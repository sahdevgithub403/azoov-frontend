import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInvoice } from '../../api/invoiceApi';
import { formatCurrency } from '../../utils/formatCurrency';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

export const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await getInvoice(id);
      setInvoice(response.data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  if (!invoice) {
    return <div className="text-center py-8">Invoice not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/invoices" className="text-primary-500 hover:underline mb-2 block">
            ← Back to Invoices
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">🖨️ Print</Button>
          <Button variant="outline">📥 Download PDF</Button>
          <Button className="bg-primary-500 hover:bg-primary-600">✉️ Email Invoice</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded flex items-center justify-center text-white">
              🛍️
            </div>
            <div>
              <h2 className="text-2xl font-bold">The Local Shop</h2>
              <p className="text-gray-600">SINCE 2018</p>
              <p className="text-sm text-gray-500 mt-2">
                123 Market Street, Suite 400<br />
                Business City, BC 90210
              </p>
              <p className="text-sm text-gray-500">support@localshop.com</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              PAID
            </span>
            <div className="mt-4 text-left space-y-1">
              <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Issued Date:</strong> {new Date(invoice.issuedDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              👤 BILLED TO
            </h3>
            <p className="font-semibold">{invoice.customer?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600">{invoice.customer?.email || 'N/A'}</p>
            <p className="text-sm text-gray-600 mt-2">{invoice.customer?.address || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              🚚 SHIPPED TO
            </h3>
            <p className="font-semibold">{invoice.customer?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600">{invoice.customer?.address || 'N/A'}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold">DESCRIPTION</th>
                <th className="pb-3 font-semibold text-center">QTY</th>
                <th className="pb-3 font-semibold text-right">UNIT PRICE</th>
                <th className="pb-3 font-semibold text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">
                    <p className="font-medium">{item.description}</p>
                    {item.product?.sku && (
                      <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                    )}
                  </td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right font-semibold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="py-4 text-right font-semibold">
                  Subtotal:
                </td>
                <td className="py-4 text-right font-semibold">{formatCurrency(invoice.subtotal || 0)}</td>
              </tr>
              {invoice.discount > 0 && (
                <tr>
                  <td colSpan="3" className="py-2 text-right">Discount:</td>
                  <td className="py-2 text-right">-{formatCurrency(invoice.discount)}</td>
                </tr>
              )}
              {invoice.tax > 0 && (
                <tr>
                  <td colSpan="3" className="py-2 text-right">Tax:</td>
                  <td className="py-2 text-right">{formatCurrency(invoice.tax)}</td>
                </tr>
              )}
              <tr className="border-t-2">
                <td colSpan="3" className="py-4 text-right text-xl font-bold">
                  Total:
                </td>
                <td className="py-4 text-right text-xl font-bold text-primary-600">
                  {formatCurrency(invoice.total || 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {invoice.internalNote && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600"><strong>Internal Note:</strong> {invoice.internalNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;

