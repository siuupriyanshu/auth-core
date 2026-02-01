'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { ErrorBanner } from './error-banner'

interface FormField {
  name: string
  label: string
  type: string
  required?: boolean
  validate?: (value: string) => string | null
}

interface AuthFormProps {
  title: string
  fields: FormField[]
  onSubmit: (data: Record<string, string>) => Promise<void>
  submitLabel?: string
  loading?: boolean
  error?: string | null
  onErrorDismiss?: () => void
}

export function AuthForm({
  title,
  fields,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  error = null,
  onErrorDismiss,
}: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: null }))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string | null> = {}

    fields.forEach((field) => {
      if (field.required && !formData[field.name].trim()) {
        errors[field.name] = `${field.label} is required`
      } else if (field.validate) {
        const error = field.validate(formData[field.name])
        if (error) {
          errors[field.name] = error
        }
      }
    })

    setFieldErrors(errors)
    return Object.values(errors).every((err) => err === null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      // Error is handled by parent component
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>

      <ErrorBanner message={error} onDismiss={onErrorDismiss} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={loading}
              aria-invalid={!!fieldErrors[field.name]}
              aria-describedby={fieldErrors[field.name] ? `${field.name}-error` : undefined}
            />
            {fieldErrors[field.name] && (
              <p id={`${field.name}-error`} className="text-destructive text-sm">
                {fieldErrors[field.name]}
              </p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
          {submitLabel}
        </Button>
      </form>
    </div>
  )
}
