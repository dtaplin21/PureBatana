import React, { useState } from 'react';
import { paymentService } from '../lib/paymentService';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const StripeTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testStripeConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await paymentService.testStripeConnection();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Stripe Connection Test</CardTitle>
        <CardDescription>
          Test the connection to the Railway backend Stripe service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testStripeConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Test Stripe Connection'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-medium text-red-800">Error</h4>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={result.success ? "default" : "destructive"}>
                {result.success ? "Success" : "Failed"}
              </Badge>
              <span className="text-sm text-gray-600">
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>

            {result.success && result.data && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div>
                  <h4 className="font-medium text-green-800">Account Details</h4>
                  <p className="text-sm text-green-600">
                    <strong>ID:</strong> {result.data.accountId}
                  </p>
                  <p className="text-sm text-green-600">
                    <strong>Name:</strong> {result.data.accountName}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800">Status</h4>
                  <p className="text-sm text-green-600">
                    <strong>Charges:</strong> {result.data.chargesEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                  <p className="text-sm text-green-600">
                    <strong>Payouts:</strong> {result.data.payoutsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            )}

            {!result.success && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <h4 className="font-medium text-red-800">Test Failed</h4>
                <p className="text-red-600">{result.message || result.error}</p>
              </div>
            )}

            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                View Raw Response
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeTest;
