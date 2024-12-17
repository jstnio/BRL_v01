import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useMasterDataStore } from '../../store/masterDataStore';
import { BaseEntity } from '../../types/common';
import { X } from 'lucide-react';
import ContactPersonFields from '../contacts/ContactPersonFields';

interface Props {
  collectionName: string;
  entity?: BaseEntity;
  onClose: () => void;
  title: string;
  extraFields?: React.ReactNode;
  form?: UseFormReturn<any>;
}

export default function EntityForm({ collectionName, entity, onClose, title, extraFields, form }: Props) {
  // ... existing EntityForm implementation ...
}