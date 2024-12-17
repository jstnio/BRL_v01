import { View, Text } from '@react-pdf/renderer';
import { styles } from '../../../services/pdfConfig';
import { HBLPackage } from '../../../types/hbl';

interface Props {
  packages: HBLPackage[];
}

export default function HBLCargoDetails({ packages }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cargo Details</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Quantity</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Type</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
        </View>
        {packages.map((pkg, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{pkg.quantity}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{pkg.type}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{pkg.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}