import { UseFormReturn } from 'react-hook-form';
import { BaseEntity } from '../../types/common';

interface Props {
  form: UseFormReturn<BaseEntity>;
}

export default function ContactPersonFields({ form }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Contact Person</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="contactPerson.name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="contactPerson.name"
            {...form.register('contactPerson.name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="contactPerson.email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="contactPerson.email"
            {...form.register('contactPerson.email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          {form.formState.errors.contactPerson?.email && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.contactPerson.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contactPerson.phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="contactPerson.phone"
            {...form.register('contactPerson.phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}