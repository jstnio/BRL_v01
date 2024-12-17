import { View, Text } from '@react-pdf/renderer';
import { styles } from '../../../services/pdfConfig';

interface Props {
  blNumber: string;
}

export default function HBLHeader({ blNumber }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>BRL</Text>
      </View>
      <View>
        <Text style={styles.title}>HOUSE BILL OF LADING</Text>
        <Text>B/L No: {blNumber}</Text>
      </View>
    </View>
  );
}