const braintree = require('braintree');
require("dotenv").config();


const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: process.env.BRAINTREE_MERCHANT_ID,
	publicKey: process.env.BRAINTREE_PUBLIC_KEY,
	privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

class brainTree {
  async ganerateToken(req, res) {
    try {
      const response = await gateway.clientToken.generate({});
      return res.json(response);
    } catch (err) {
      return res.json(err);
    }
  }

  async paymentProcess(req, res) {
    try {
      const { amountTotal, paymentMethod } = req.body;

      // Get the current exchange rate from USD to VND
      const usdToVndRate = 24.27;

      // Convert the amount to VND using the dynamic exchange rate
      const usdAmount = (amountTotal / usdToVndRate).toFixed(2);

      // Make the payment transaction
      const result = await gateway.transaction.sale({
        amount: usdAmount,
        paymentMethodNonce: paymentMethod,
        options: {
          submitForSettlement: true,
        },
      });

      if (result.success) {
        console.log("Transaction ID: " + result.transaction.id);
        return res.json(result);
      } else {
        console.error(result.message);
        return res.json(result);
      }
    } catch (err) {
      console.error(err);
      return res.json(err);
    }
  }
}

const brainTreeController = new brainTree();
module.exports = brainTreeController;
