import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useMasterDataStore } from '../../store/masterDataStore';
import { BaseEntity } from '../../types/common';
import { X } from 'lucide-react';
import { Button } from './index';
import { showSuccess, showError } from '../../lib/utils';
import ContactPersonFields from '../contacts/ContactPersonFields';

interface Props {
  collectionName: string;
  entity?: BaseEntity;
  onClose: () => void;
  title: string;
  extraFields?: React.ReactNode;
  form?: UseFormReturn<BaseEntity>;
}

export default function EntityForm({ collectionName, entity, onClose, title, extraFields, form: externalForm }: Props) {
  const { addEntity, updateEntity } = useMasterDataStore();
  const form = externalForm || useForm({
    defaultValues: entity || {
      name: '',
      code: '',
      address: '',
      email: '',
      phone: '',
      contactPerson: {
        name: '',
        email: '',
        phone: '',
      },
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (entity) {
      reset(entity);
    }
  }, [entity, reset]);

  const onSubmit = async (data: BaseEntity) => {
    try {
      if (entity) {
        await updateEntity(collectionName, entity.id, data);
        showSuccess('Entity updated successfully');
      } else {
        await addEntity(collectionName, data);
        showSuccess('Entity added successfully');
      }
      onClose();
    } catch (error) {
      showError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...form.register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Code
          </label>
          <input
            type="text"
            id="code"
            {...form.register('code', { required: 'Code is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {form.formState.errors.code && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.code.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            rows={3}
            {...form.register('address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...form.register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            {...form.register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <ContactPersonFields form={form} />

        {extraFields}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={form.formState.isSubmitting}>
          {entity ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}