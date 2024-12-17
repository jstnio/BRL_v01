import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../../services/pdfService';

interface PartyInfo {
  name: string;
  address: string;
  contact: string;
}

interface Props {
  title: string;
  party: PartyInfo;
}

export default function HBLPartyInfo({ title, party }: Props) {
  return (
    <View style={pdfStyles.section}>
      <Text style={pdfStyles.sectionTitle}>{title}</Text>
      <Text>{party.name}</Text>
      <Text>{party.address}</Text>
      <Text>{party.contact}</Text>
    </View>
  );
}