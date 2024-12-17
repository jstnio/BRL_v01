import { View, Text, Image } from '@react-pdf/renderer';
import { pdfStyles } from '../../services/pdfService';

interface Props {
  blNumber: string;
}

export default function HBLHeader({ blNumber }: Props) {
  return (
    <View style={pdfStyles.header}>
      <Image
        src="/brl-logo.png"
        style={{ width: 100, height: 50 }}
      />
      <View>
        <Text style={pdfStyles.title}>HOUSE BILL OF LADING</Text>
        <Text>B/L No: {blNumber}</Text>
      </View>
    </View>
  );
}