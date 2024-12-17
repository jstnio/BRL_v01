import { View, Text } from '@react-pdf/renderer';
import { styles } from '../../../services/pdfConfig';

interface Props {
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt?: string;
  placeOfDelivery?: string;
}

export default function HBLPortInfo({ 
  portOfLoading, 
  portOfDischarge,
  placeOfReceipt,
  placeOfDelivery 
}: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Port Information</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text style={styles.bold}>Port of Loading</Text>
            <Text>{portOfLoading}</Text>
          </View>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text style={styles.bold}>Port of Discharge</Text>
            <Text>{portOfDischarge}</Text>
          </View>
        </View>
        {(placeOfReceipt || placeOfDelivery) && (
          <View style={styles.tableRow}>
            {placeOfReceipt && (
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={styles.bold}>Place of Receipt</Text>
                <Text>{placeOfReceipt}</Text>
              </View>
            )}
            {placeOfDelivery && (
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={styles.bold}>Place of Delivery</Text>
                <Text>{placeOfDelivery}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}