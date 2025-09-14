import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

const PropertyBrochureGenerator = ({ listing }) => {
  console.log(listing);
  const unitType = listing?.unitType || "";
  const titleCaseUnitType = unitType
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const community = listing?.community;
  const completionDate = listing?.completionDate;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    communityName: community || "",
    completionDate: completionDate || "",
    unitType: titleCaseUnitType || "",
    paymentOption: "Payment Plan",
    alreadyPaid: "",
    originalPrice: "",
    sellingPrice: "",
    trusteeFee: "",
    paymentPlan: [
      {
        dueDate: "Transfer Date",
        percentage: "",
        amount: "",
      },
    ],
  });

  useEffect(() => {
    const checkScreenSize = () => setIsMobileView(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      // Calculate derived fields
      const sellingPrice = parseFloat(updatedData.sellingPrice) || 0;
      const originalPrice = parseFloat(updatedData.originalPrice) || 0;
      const alreadyPaid = parseFloat(updatedData.alreadyPaid) || 0;
      const trusteeFee = parseFloat(updatedData.trusteeFee) || 0;
      const includePremium = updatedData.paymentOption !== "Ready";
      const premium = includePremium ? sellingPrice - originalPrice : 0;
      const dldFee = sellingPrice * 0.04;
      const commission = sellingPrice * 0.021;
      const conveyancingFee = 3200;
      const totalExtra =
        premium + dldFee + commission + conveyancingFee + trusteeFee;

      // Update first row of payment plan
      const updatedPaymentPlan = [...updatedData.paymentPlan];
      updatedPaymentPlan[0] = {
        dueDate: "Transfer Date",
        percentage: `${100 - alreadyPaid}% + Extras`,
        amount: (alreadyPaid / 100) * originalPrice + totalExtra,
      };

      return { ...updatedData, paymentPlan: updatedPaymentPlan };
    });
  };

  const addPaymentRow = () => {
    setFormData((prev) => ({
      ...prev,
      paymentPlan: [
        ...prev.paymentPlan,
        { dueDate: "", percentage: "", amount: "" },
      ],
    }));
  };

  const updatePaymentRow = (index, field, value) => {
    setFormData((prev) => {
      const updatedPaymentPlan = [...prev.paymentPlan];
      updatedPaymentPlan[index] = {
        ...updatedPaymentPlan[index],
        [field]: value,
      };
      return { ...prev, paymentPlan: updatedPaymentPlan };
    });
  };

  const removePaymentRow = (index) => {
    if (index === 0) return; // Prevent removing first row
    setFormData((prev) => ({
      ...prev,
      paymentPlan: prev.paymentPlan.filter((_, i) => i !== index),
    }));
  };

  const generatePDF = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate derived fields
      const sellingPrice = parseFloat(formData.sellingPrice) || 0;
      const originalPrice = parseFloat(formData.originalPrice) || 0;
      const alreadyPaid = parseFloat(formData.alreadyPaid) || 0;
      const trusteeFee = parseFloat(formData.trusteeFee) || 0;
      const includePremium = formData.paymentOption !== "Ready";
      const premium = includePremium ? sellingPrice - originalPrice : 0;
      const dldFee = sellingPrice * 0.04;
      const commission = sellingPrice * 0.021;
      const conveyancingFee = 3200;
      const totalExtra =
        premium + dldFee + commission + conveyancingFee + trusteeFee;
      const premiumDisplay = includePremium
        ? `AED ${premium.toLocaleString()}`
        : "-";

      // Create HTML content for the brochure
      const brochureHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Property Brochure</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              background: white;
            }
            .page {
              width: 297mm;
              height: 210mm;
              page-break-after: always;
              position: relative;
              overflow: hidden;
              padding: 20px;
              box-sizing: border-box;
            }
            .page:last-child {
              page-break-after: avoid;
            }
            .header {
              background: #0c372a;
              color: white;
              padding: 20px;
              text-align: center;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: -20px -20px 20px -20px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .header p {
              margin: 5px 0 0 0;
              font-size: 16px;
              opacity: 0.9;
            }
            .content {
              height: calc(100% - 80px);
            }
            .single-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 8px;
            }
            .image-container {
              display: flex;
              gap: 20px;
              height: 100%;
              align-items: center;
            }
            .image-container img {
              width: 50%;
              height: 80%;
              object-fit: cover;
              border-radius: 8px;
            }
            .full-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 8px;
            }
            .grid-container {
              display: grid;
              grid-template-columns: 40% 60%;
              grid-template-rows: 1fr 1fr;
              gap: 15px;
              height: 100%;
            }
            .grid-container img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 8px;
            }
            .left-image {
              grid-row: 1 / 3;
            }
            .right-top {
              grid-column: 2;
              grid-row: 1;
            }
            .right-bottom {
              grid-column: 2;
              grid-row: 2;
            }
            .payment-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .payment-table th,
            .payment-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .payment-table th {
              background: #0c372a;
              color: white;
              font-weight: bold;
            }
            .payment-table tr:nth-child(even) {
              background: #f9f9f9;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .info-section h3 {
              color: #0c372a;
              margin-bottom: 15px;
              font-size: 18px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
            }
            .info-table th,
            .info-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .info-table th {
              background: #0c372a;
              color: white;
              font-weight: bold;
            }
            .company-page {
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: -20px;
              padding: 40px;
            }
            .company-logo {
              width: 120px;
              height: 80px;
              margin-bottom: 30px;
            }
            .company-logo img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .company-name {
              font-size: 32px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .company-subtitle {
              font-size: 18px;
              color: #666;
              margin-bottom: 30px;
            }
            .company-contact {
              font-size: 14px;
              color: #888;
              line-height: 1.6;
            }
            .payment-schedule {
              margin-top: 30px;
            }
            .payment-schedule h3 {
              color: #0c372a;
              margin-bottom: 15px;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <!-- Page 1: Title and Single Image -->
          <div class="page">
            <div class="header">
              <div>
                <h1>${
                  formData.communityName ||
                  listing?.projectName ||
                  "Property Brochure"
                }</h1>
                <p>${formData.unitType || "Villa"} - ${
        formData.completionDate || "2024-12-15"
      }</p>
              </div>
            </div>
            <div class="content">
              ${
                listing?.images?.length >= 1
                  ? `<img src="${listing.images[0].url}" alt="Property Image" class="single-image">`
                  : ""
              }
            </div>
          </div>

          <!-- Page 2: Payment Plan -->
          <div class="page">
            <div class="header">
              <h1>Payment Plan</h1>
            </div>
            <div class="content">
              <div class="info-grid">
                <div class="info-section">
                  <h3>Project Information</h3>
                  <table class="info-table">
                    <tr><th>Community</th><td>${
                      formData.communityName || listing?.community || "Nakheel"
                    }</td></tr>
                    <tr><th>Unit Type</th><td>${
                      formData.unitType || "Villa"
                    }</td></tr>
                    <tr><th>Completion Date</th><td>${
                      formData.completionDate || "2024-12-15"
                    }</td></tr>
                    <tr><th>Original Price</th><td>AED ${originalPrice.toLocaleString()}</td></tr>
                    <tr><th>Selling Price</th><td>AED ${sellingPrice.toLocaleString()}</td></tr>
                    <tr><th>Already Paid</th><td>${
                      formData.alreadyPaid || "0"
                    }%</td></tr>
                  </table>
                </div>
                <div class="info-section">
                  <h3>Extra Costs</h3>
                  <table class="info-table">
                    ${
                      includePremium
                        ? `<tr><th>Premium</th><td>${premiumDisplay}</td></tr>`
                        : ""
                    }
                    <tr><th>DLD Fee (4%)</th><td>AED ${dldFee.toLocaleString()}</td></tr>
                    <tr><th>Commission (2.1%)</th><td>AED ${commission.toLocaleString()}</td></tr>
                    <tr><th>Conveyancing Fee</th><td>AED ${conveyancingFee.toLocaleString()}</td></tr>
                    <tr><th>Trustee Fee</th><td>AED ${trusteeFee.toLocaleString()}</td></tr>
                    <tr><th>Total Extra</th><td>AED ${totalExtra.toLocaleString()}</td></tr>
                  </table>
                </div>
              </div>
              <div class="payment-schedule">
                <h3>Payment Schedule</h3>
                <table class="payment-table">
                  <thead>
                    <tr>
                      <th>Due Date</th>
                      <th>Percentage</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${formData.paymentPlan
                      .map(
                        (row) => `
                      <tr>
                        <td>${row.dueDate}</td>
                        <td>${row.percentage}</td>
                        <td>AED ${
                          parseFloat(row.amount).toLocaleString() || "0"
                        }</td>
                      </tr>
                    `
                      )
                      .join("")}
                    <tr style="background: #0c372a; color: white; font-weight: bold;">
                      <td>Grand Total</td>
                      <td>100%</td>
                      <td>AED ${(
                        sellingPrice + totalExtra
                      ).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Page 3: Floorplan -->
          ${
            listing?.images?.length >= 2
              ? `
          <div class="page">
            <div class="content" style="padding: 0;">
              <img src="${listing.images[1].url}" alt="Floor Plan" class="full-image">
            </div>
          </div>
          `
              : ""
          }

          <!-- Page 4: Gallery Image -->
          ${
            listing?.images?.length >= 3
              ? `
          <div class="page">
            <div class="content" style="padding: 0;">
              <img src="${listing.images[2].url}" alt="Gallery Image" class="full-image">
            </div>
          </div>
          `
              : ""
          }

          <!-- Image Grid Pages -->
          ${(() => {
            let html = "";
            if (listing?.images?.length > 3) {
              let imageIndex = 3;
              while (imageIndex < listing.images.length) {
                html += `
                <div class="page">
                  <div class="content">
                    <div class="grid-container">
                      ${
                        imageIndex < listing.images.length
                          ? `<img src="${listing.images[imageIndex].url}" alt="Gallery Image" class="left-image">`
                          : ""
                      }
                      ${
                        imageIndex + 1 < listing.images.length
                          ? `<img src="${
                              listing.images[imageIndex + 1].url
                            }" alt="Gallery Image" class="right-top">`
                          : ""
                      }
                      ${
                        imageIndex + 2 < listing.images.length
                          ? `<img src="${
                              listing.images[imageIndex + 2].url
                            }" alt="Gallery Image" class="right-bottom">`
                          : ""
                      }
                    </div>
                  </div>
                </div>
                `;
                imageIndex += 3;
              }
            }
            return html;
          })()}

          <!-- Last Page: Company -->
          <div class="page">
            <div class="content company-page">
              <div class="company-logo">
                <img src="/logo.svg" alt="IMZA PREMIUM PROPERTIES" />
              </div>
              <div class="company-name">IMZA PREMIUM PROPERTIES</div>
              <div class="company-subtitle">Marah Al Houssaini - Property Admin</div>
              <div class="company-contact">
                <p>For enquiries: www.imzaproperties.com</p>
                <p>Call: +971 50 123 4567</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a new window with the brochure content
      const newWindow = window.open("", "_blank");
      newWindow.document.write(brochureHTML);
      newWindow.document.close();

      // Wait for images to load, then print
      setTimeout(() => {
        newWindow.print();
        newWindow.close();
      }, 1000);

      setIsModalOpen(false);
    } catch {
      setError("Failed to generate brochure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between gap-2">
        {isMobileView ? (
          <a
            href={`https://myemirateshome.com/imza/inventory-pdf-handler?id=${listing?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm border border-[#0c372a] text-gray-600 hover:bg-green-100 cursor-pointer transition duration-150 font-medium w-fit"
          >
            <Download size={16} />
            Brochure
          </a>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading || !listing}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm ${
              loading || !listing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "border border-[#0c372a] text-gray-600 hover:bg-green-100 cursor-pointer"
            } transition duration-150 font-medium`}
          >
            <Download size={16} />
            {loading ? "Generating..." : "Comprehensive Brochure"}
          </button>
        )}

        <a
          target="_blank"
          rel="noopener noreferrer"
          href={
            `https://connecteo.in/imza-property-listing/download-pdf.php?type=agent&id=` +
              listing?.originalId || listing?.id
          }
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm ${
            !listing
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "border border-[#0c372a] text-gray-600 hover:bg-green-100 cursor-pointer"
          } transition duration-150 font-medium`}
        >
          <Download size={16} />
          Brochure
        </a>

        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 z-50 flex items-start justify-center pt-16 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Sales Offer Details
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Enter property information to generate brochure
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Property Information Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Property Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="paymentOption"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Payment Option *
                      </label>
                      <select
                        id="paymentOption"
                        name="paymentOption"
                        value={formData.paymentOption}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        required
                      >
                        <option value="Payment Plan">Payment Plan</option>
                        <option value="Ready">Ready</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="communityName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Community Name *
                      </label>
                      <input
                        id="communityName"
                        type="text"
                        name="communityName"
                        placeholder="Enter community name"
                        value={formData.communityName}
                        onChange={handleInputChange}
                        readOnly={formData.communityName !== ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="completionDate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Completion Date *
                      </label>
                      <input
                        id="completionDate"
                        type="date"
                        name="completionDate"
                        value={formData.completionDate}
                        onChange={handleInputChange}
                        readOnly={formData.completionDate !== ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="unitType"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Unit Type *
                      </label>
                      <input
                        id="unitType"
                        type="text"
                        name="unitType"
                        placeholder="Enter unit type"
                        value={formData.unitType}
                        onChange={handleInputChange}
                        readOnly={formData.unitType !== ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="alreadyPaid"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Already Paid (%) *
                      </label>
                      <input
                        id="alreadyPaid"
                        type="number"
                        name="alreadyPaid"
                        placeholder="0"
                        value={formData.alreadyPaid}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Information Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Pricing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        htmlFor="originalPrice"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Original Price (AED) *
                      </label>
                      <input
                        id="originalPrice"
                        type="number"
                        name="originalPrice"
                        placeholder="0"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sellingPrice"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Selling Price (AED) *
                      </label>
                      <input
                        id="sellingPrice"
                        type="number"
                        name="sellingPrice"
                        placeholder="0"
                        value={formData.sellingPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="trusteeFee"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Trustee Fee (AED) *
                      </label>
                      <input
                        id="trusteeFee"
                        type="number"
                        name="trusteeFee"
                        placeholder="0"
                        value={formData.trusteeFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Plan Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Payment Plan
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-700 mb-3">
                      <div className="col-span-4">Due Date</div>
                      <div className="col-span-4">Percentage</div>
                      <div className="col-span-3">Amount (AED)</div>
                      <div className="col-span-1"></div>
                    </div>

                    {formData.paymentPlan.map((row, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-3 items-center mb-3"
                      >
                        <div className="col-span-4">
                          <input
                            type="date"
                            value={row.dueDate}
                            onChange={(e) =>
                              updatePaymentRow(index, "dueDate", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={row.percentage}
                            onChange={(e) =>
                              updatePaymentRow(
                                index,
                                "percentage",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            placeholder="Percentage"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={row.amount}
                            onChange={(e) =>
                              updatePaymentRow(index, "amount", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            placeholder="Amount"
                          />
                        </div>
                        <div className="col-span-1">
                          {index !== 0 && (
                            <button
                              onClick={() => removePaymentRow(index)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                              title="Remove row"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addPaymentRow}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    <div className="w-4 h-4 border-2 border-blue-600 rounded-full mr-2 flex items-center justify-center">
                      <span className="text-blue-600 text-xs">+</span>
                    </div>
                    Add Payment Row
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generatePDF}
                    disabled={
                      loading ||
                      !formData.communityName ||
                      !formData.completionDate ||
                      !formData.unitType ||
                      !formData.alreadyPaid ||
                      !formData.originalPrice ||
                      !formData.sellingPrice ||
                      !formData.trusteeFee
                    }
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      loading ||
                      !formData.communityName ||
                      !formData.completionDate ||
                      !formData.unitType ||
                      !formData.alreadyPaid ||
                      !formData.originalPrice ||
                      !formData.sellingPrice ||
                      !formData.trusteeFee
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </div>
                    ) : (
                      "Generate PDF"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyBrochureGenerator;
