import { Document, Page } from '@react-pdf/renderer';
import { styles } from '../../services/pdfConfig';
import { HBLData } from '../../types/hbl';
import HBLHeader from './sections/HBLHeader';
import HBLPartyInfo from './sections/HBLPartyInfo';
import HBLCargoDetails from './sections/HBLCargoDetails';
import HBLVesselDetails from './sections/HBLVesselDetails';
import HBLPortInfo from './sections/HBLPortInfo';

interface Props {
  data: HBLData;
}

export default function HBLDocument({ data }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HBLHeader blNumber={data.blNumber} />
        
        <HBLPartyInfo 
          title="Shipper"
          party={data.shipper}
        />
        
        <HBLPartyInfo 
          title="Consignee"
          party={data.consignee}
        />
        
        <HBLPartyInfo 
          title="Notify Party"
          party={data.notifyParty}
        />
        
        <HBLCargoDetails packages={data.packages} />
        
        <HBLVesselDetails 
          vessel={data.vessel}
          voyageNo={data.voyageNo}
        />
        
        <HBLPortInfo 
          portOfLoading={data.portOfLoading}
          portOfDischarge={data.portOfDischarge}
          placeOfReceipt={data.placeOfReceipt}
          placeOfDelivery={data.placeOfDelivery}
        />
      </Page>
    </Document>
  );
}