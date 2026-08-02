import "./finflow-wallet.scss";

export const FinFlowWalletCover = () => (
  <div className="finflow-product-cover" aria-hidden="true">
    <div className="finflow-cover-bank-card">
      <span />
      <strong>FinFlow</strong>
      <small>5375 •••• 8042</small>
    </div>
    <div className="finflow-cover-products">
      <span className="is-cashback" />
      <span className="is-deposit" />
      <span className="is-credit" />
      <span className="is-saving" />
    </div>
    <div className="finflow-cover-balance">$12k</div>
  </div>
);
