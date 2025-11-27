import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, TrendingUp, X } from 'lucide-react';

interface QuickActionsBarProps {
  onAddIncome?: (amount: number) => void;
  onAddExpense?: (amount: number) => void;
  onInvest?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function QuickActionsBar({
  onAddIncome = () => {},
  onAddExpense = () => {},
  onInvest = () => {},
  isOpen = true,
  onToggle = () => {},
}: QuickActionsBarProps) {
  const [incomeDialog, setIncomeDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const handleAddIncome = () => {
    const amount = parseFloat(incomeAmount);
    if (amount > 0) {
      onAddIncome(amount);
      setIncomeAmount('');
      setIncomeDialog(false);
    }
  };

  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (amount > 0) {
      onAddExpense(amount);
      setExpenseAmount('');
      setExpenseDialog(false);
    }
  };

  return (
    <>
      {/* Fixed Floating Action Bar */}
      {isOpen && (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-3 bg-blue-950/80 backdrop-blur-md border border-blue-400/30 rounded-lg px-4 py-4 shadow-2xl animate-slideInUp w-64">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-blue-300">Quick Actions</p>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 text-blue-300 hover:text-blue-100"
            onClick={onToggle}
            data-testid="button-close-actions"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Add Income Button */}
        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30 rounded-md px-3 transition-all hover:shadow-md"
          onClick={() => setIncomeDialog(true)}
          data-testid="button-add-income"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="text-xs font-semibold">Add Income</span>
        </Button>

        {/* Add Expense Button */}
        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30 rounded-md px-3 transition-all hover:shadow-md"
          onClick={() => setExpenseDialog(true)}
          data-testid="button-add-expense"
        >
          <Minus className="h-4 w-4 mr-2" />
          <span className="text-xs font-semibold">Add Expense</span>
        </Button>

        {/* Invest Now Button */}
        <Button
          size="sm"
          className="w-full justify-start bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-md px-3 transition-all hover:shadow-md"
          onClick={onInvest}
          data-testid="button-invest-now"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          <span className="text-xs font-semibold">Invest Now</span>
        </Button>
      </div>
      )}

      {/* Toggle Button - always visible */}
      {!isOpen && (
        <Button
          size="icon"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 h-16 w-16 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center border border-blue-300/50"
          onClick={onToggle}
          data-testid="button-toggle-actions"
        >
          <Plus className="h-7 w-7 text-white" />
        </Button>
      )}

      {/* Income Dialog */}
      <Dialog open={incomeDialog} onOpenChange={setIncomeDialog}>
        <DialogContent className="animate-tabSlideIn">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-400" />
              Add Income
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="income-amount">Amount (₹)</Label>
              <Input
                id="income-amount"
                type="number"
                placeholder="0"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                className="bg-blue-950/50 border-blue-400/30 focus:border-blue-400/60"
                data-testid="input-income-amount"
              />
            </div>
            <Button
              onClick={handleAddIncome}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              data-testid="button-submit-income"
            >
              <Plus className="h-4 w-4 mr-2" />
              Confirm Income
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={expenseDialog} onOpenChange={setExpenseDialog}>
        <DialogContent className="animate-tabSlideIn">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-red-400" />
              Add Expense
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount (₹)</Label>
              <Input
                id="expense-amount"
                type="number"
                placeholder="0"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="bg-blue-950/50 border-blue-400/30 focus:border-blue-400/60"
                data-testid="input-expense-amount"
              />
            </div>
            <Button
              onClick={handleAddExpense}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
              data-testid="button-submit-expense"
            >
              <Minus className="h-4 w-4 mr-2" />
              Confirm Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
