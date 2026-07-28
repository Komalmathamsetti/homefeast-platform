export default function CookProfilePage() {
  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="header">
            <h1>Cook Profile</h1>
            <p>Manage your personal details and delivery settings.</p>
          </div>

          <div className="formGrid">
            <div className="field">
              <label>Full Name</label>
              <input type="text" defaultValue="Aarav Sharma" />
            </div>

            <div className="field">
              <label>Email</label>
              <input type="email" defaultValue="aarav@homefeast.com" readOnly />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input type="tel" defaultValue="+91 98765 43210" />
            </div>

            <div className="field full">
              <label>Bio</label>
              <textarea
                rows="4"
                defaultValue="Homemade meals prepared with fresh ingredients and delivered daily."
              />
            </div>

            <div className="field">
              <label>Service Area</label>
              <input type="text" defaultValue="Andheri, Mumbai" />
            </div>

            <div className="field">
              <label>Delivery Timings</label>
              <input type="text" defaultValue="Mon - Sat, 11:00 AM - 8:00 PM" />
            </div>
          </div>

          <div className="statsGrid">
            <div className="statCard">
              <span>Average Rating</span>
              <strong>4.8 / 5</strong>
            </div>
            <div className="statCard">
              <span>Approval Status</span>
              <strong className="approved">Approved</strong>
            </div>
          </div>

          <button className="saveBtn">Save Changes</button>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        .page {
          min-height: 100vh;
          background: linear-gradient(180deg, #fffdf8 0%, #fff8ef 100%);
          padding: 24px;
          font-family: Inter, Arial, sans-serif;
          color: #2b2b2b;
        }
        .container {
          max-width: 980px;
          margin: 0 auto;
        }
        .card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(255, 153, 0, 0.08);
          border: 1px solid #fde7c7;
          padding: 28px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(255, 153, 0, 0.12);
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          color: #e86f00;
        }
        .header p {
          margin: 8px 0 0;
          color: #6f6f6f;
        }
        .formGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 28px;
        }
        .field.full {
          grid-column: 1 / -1;
        }
        .field label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #7a4b12;
        }
        .field input,
        .field textarea {
          width: 100%;
          border: 1px solid #f0d8b5;
          background: #fffdf9;
          border-radius: 16px;
          padding: 14px 16px;
          outline: none;
          font-size: 15px;
          color: #333;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .field input:focus,
        .field textarea:focus {
          border-color: #ff9d2b;
          box-shadow: 0 0 0 4px rgba(255, 157, 43, 0.14);
        }
        .field input[readOnly] {
          background: #fff4dd;
          color: #7a6a52;
          cursor: not-allowed;
        }
        .statsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 22px;
        }
        .statCard {
          background: linear-gradient(180deg, #fffaf0 0%, #fff3db 100%);
          border: 1px solid #f6ddb0;
          border-radius: 18px;
          padding: 18px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .statCard span {
          display: block;
          color: #8a6b3f;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .statCard strong {
          font-size: 20px;
          color: #2f2f2f;
        }
        .approved {
          color: #d66d00 !important;
        }
        .saveBtn {
          width: 100%;
          margin-top: 26px;
          border: none;
          border-radius: 18px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #ff9d2b 0%, #f07a00 100%);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          box-shadow: 0 10px 24px rgba(240, 122, 0, 0.24);
        }
        .saveBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(240, 122, 0, 0.3);
        }
        .saveBtn:active {
          transform: translateY(0);
          opacity: 0.95;
        }
        @media (max-width: 768px) {
          .page { padding: 16px; }
          .card { padding: 20px; border-radius: 20px; }
          .formGrid, .statsGrid { grid-template-columns: 1fr; }
          .header h1 { font-size: 28px; }
        }
      `}</style>
    </div>
  );
}