import { Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { 
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2',
      fontWeight: 'bold' 
    }
  ]
});

// PDF Styles
export const pdfStyles = {
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Inter'
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  section: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
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
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    padding: 5
  },
  tableRow: {
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
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
    fontWeight: 'bold'
  }
};

export const formatPDFDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};