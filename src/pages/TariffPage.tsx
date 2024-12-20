import React from 'react';
import TariffCheck from '../components/tariffs/TariffCheck';
import { PageHeader } from '../components/common';

export default function TariffPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Tariff Check"
        description="Check ECU Worldwide tariffs for different routes and products"
      />
      <div className="mt-8">
        <TariffCheck />
      </div>
    </div>
  );
}
