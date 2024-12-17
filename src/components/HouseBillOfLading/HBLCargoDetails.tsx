import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../../services/pdfService';

interface Package {
  quantity: string;
  type: string;
  description: string;
}

interface Props {
  packages: Package[];
}

export default function HBLCargoDetails({ packages }: Props) {
  return (
    <View style={pdfStyles.section}>
      <Text style={pdfStyles.sectionTitle}>Cargo Details</Text>
      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableHeader}>
          <Text style={[pdfStyles.tableCell, { flex: 1 }]}>Quantity</Text>
          <Text style={[pdfStyles.tableCell, { flex: 1 }]}>Type</Text>
          <Text style={[pdfStyles.tableCell, { flex: 2 }]}>Description</Text>
        </View>
        {packages.map((pkg, index) => (
          <View key={index} style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{pkg.quantity}</Text>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{pkg.type}</Text>
            <Text style={[pdfStyles.tableCell, { flex: 2 }]}>{pkg.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}