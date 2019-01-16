import ConfigComprehensivePlate from './ConfigComprehensivePlate.js';
import ConfigOptionalStock from './ConfigOptionalStock.js';
import ConfigQuotationList from './ConfigQuotationList.js';
import ConfigBoardQuotes from './ConfigBoardQuotes.js';
import ConfigQuoteDetails from './ConfigQuoteDetails.js';
import ConfigCustomize from './ConfigCustomize.js';

export default {
  ...ConfigComprehensivePlate,
  ...ConfigOptionalStock,
  ...ConfigQuotationList,
  ...ConfigBoardQuotes,
  ...ConfigQuoteDetails,
  ...ConfigCustomize
}
