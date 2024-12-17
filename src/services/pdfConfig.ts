import { Font, StyleSheet } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

Font.register({
  family: 'Inter-Bold',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2'
});

// Create styles
export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Inter'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10
  },
  logo: {
    width: 100,
    height: 50,
    backgroundColor: '#193375'
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    padding: 8
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 5
  },
  section: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginBottom: 5,
    backgroundColor: '#f3f4f6',
    padding: 5
  },
  table: {
    width: '100%',
    marginBottom: 10
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 5
  },
  tableCell: {
    flex: 1,
    padding: 5
  },
  text: {
    fontSize: 10,
    marginBottom: 3
  },
  bold: {
    fontFamily: 'Inter-Bold'
  }
});