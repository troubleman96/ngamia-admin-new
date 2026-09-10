"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, Loader2, Plus, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBalance,
  useTransactions,
  useTopup,
  usePayment,
  type Payment,
} from "@/lib/api/hooks/billing";
import { useProfile } from "@/lib/api/hooks/profile";
import { formatCredits, formatDate } from "@/lib/utils";

const PRESET_AMOUNTS = [1000, 5000, 10000, 25000];

function TopupDialog() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("5000");
  const [pendingPayment, setPendingPayment] = useState<Payment | null>(null);
  const topup = useTopup();
  const { data: profile } = useProfile();
  const payment = usePayment(pendingPayment?.id, !!pendingPayment);
  const queryClient = useQueryClient();

  const clearBalanceCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["balance"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }, [queryClient]);

  useEffect(() => {
    if (!pendingPayment) return;
    if (payment.data?.status === "completed") {
      clearBalanceCache();
      toast.success("Payment successful! Credits added to your balance.");
    } else if (
      payment.data?.status === "failed" ||
      payment.data?.status === "expired"
    ) {
      toast.error("Payment failed. No charges were applied.");
    }
  }, [payment.data?.status, pendingPayment, clearBalanceCache]);

  const handleClose = () => {
    setPendingPayment(null);
    setOpen(false);
  };

  const isWaiting =
    pendingPayment && payment.data?.status === "pending" && open;

  const handleTopup = async () => {
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (!profile?.phone_verified) {
      toast.error("Your phone number must be verified before topping up.");
      return;
    }

    topup.mutate(
      { amount_tzs: amountNum },
      {
        onSuccess: (payment) => {
          setPendingPayment(payment);
          toast.info("Check your phone to approve the payment", {
            description: "A USSD prompt has been sent to your mobile number.",
          });
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (isWaiting) {
    return (
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) handleClose();
        }}
        disablePointerDismissal
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Waiting for approval</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-3 pt-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div>
                <p>
                  We&apos;ve sent a payment request of{" "}
                  <strong className="font-semibold">
                    {formatCredits(pendingPayment.amount_tzs)} TZS
                  </strong>{" "}
                  to your phone.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Approve the USSD prompt on your mobile device to complete the top-up.
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                Ref: {pendingPayment.provider_reference}
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : handleClose())}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4" /> Top up
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top up credits</DialogTitle>
          <DialogDescription>
            Choose an amount. We&apos;ll send a payment request to your phone via Snippe mobile money.
          </DialogDescription>
        </DialogHeader>

        {!profile?.phone_verified ? (
          <div className="callout callout-danger text-sm">
            Your phone number must be verified before topping up. Please verify your phone number in
            settings first.
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Amount (TZS)</Label>
              <Input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5 text-lg font-medium"
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((amt) => (
                <Button
                  key={amt}
                  type="button"
                  variant={Number(amount) === amt ? "default" : "outline"}
                  onClick={() => setAmount(String(amt))}
                  className="h-9 text-xs"
                >
                  {amt.toLocaleString()}
                </Button>
              ))}
            </div>
            <div className="callout callout-info text-sm">
              <span className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 shrink-0" />
                Credits are pegged 1:1 to TZS. {formatCredits(Number(amount) || 0)} credits will be
                added.
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleTopup}
            disabled={!profile?.phone_verified || topup.isPending}
          >
            {topup.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {topup.isPending ? "Requesting..." : "Request payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BillingPage() {
  const { data: balance, isLoading: balanceLoading } = useBalance();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions({
    limit: 25,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your credits and transaction history.
          </p>
        </div>
        <TopupDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Wallet className="h-4 w-4" />
            Available balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {balanceLoading ? (
            <Skeleton className="h-10 w-40" />
          ) : (
            <>
              <div className="text-3xl font-semibold tracking-tight">
                {formatCredits(balance?.balance ?? 0)}
                <span className="ml-2 text-base font-normal text-muted-foreground">credits</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCredits(balance?.low_balance_threshold ?? 0)} low balance threshold
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Transaction history</CardTitle>
          <CardDescription className="text-sm">
            Every credit movement in your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="divide-y">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 py-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      tx.amount >= 0 ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium capitalize">{tx.type.replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        tx.amount >= 0 ? "text-green-600" : "text-foreground"
                      }`}
                    >
                      {tx.amount >= 0 ? "+" : ""}
                      {formatCredits(tx.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Balance: {formatCredits(tx.balance_after)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Wallet className="h-5 w-5" />
              </div>
              <p className="empty-state-title">No transactions yet</p>
              <p className="empty-state-description">
                Your credit movements will appear here once you start using the API.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}