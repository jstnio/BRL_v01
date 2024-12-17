import { View, Text } from '@react-pdf/renderer';
import { styles } from '../../../services/pdfConfig';
import { HBLParty } from '../../../types/hbl';

interface Props {
  title: string;
  party: HBLParty;
}

export default function HBLPartyInfo({ title, party }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text>{party.name}</Text>
      <Text>{party.address}</Text>
      <Text>{party.contact}</Text>
      {party.email && <Text>{party.email}</Text>}
      {party.phone && <Text>{party.phone}</Text>}
    </View>
  );
}