import { View, Text } from '@react-pdf/renderer';
import { styles } from '../../../services/pdfConfig';

interface Props {
  vessel: string;
  voyageNo: string;
}

export default function HBLVesselDetails({ vessel, voyageNo }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Vessel Details</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text style={styles.bold}>Vessel</Text>
            <Text>{vessel}</Text>
          </View>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text style={styles.bold}>Voyage No.</Text>
            <Text>{voyageNo}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}