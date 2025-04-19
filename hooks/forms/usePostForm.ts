import { useState, useEffect } from 'react';
import { TiptapContent, PostStatus } from '@/types';
import { getCategories } from '@/services';

// Define the Category type to match API response
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  created_at?: string;
}

interface FormState {
  title: string;
  description: string;
  category: string;
  tags: string;
  content: TiptapContent | null;
  status: PostStatus;
  scheduledPublishAt: string | null;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
  content?: string;
}

interface UsePostFormProps {
  initialValues?: Partial<FormState>;
  onSubmit: (formData: FormState) => Promise<void>;
}

export const usePostForm = ({ initialValues = {}, onSubmit }: UsePostFormProps) => {
  // Form state
  const [formState, setFormState] = useState<FormState>({
    title: initialValues.title || '',
    description: initialValues.description || '',
    category: initialValues.category || '',
    tags: initialValues.tags || '',
    content: initialValues.content || null,
    status: initialValues.status || 'draft',
    scheduledPublishAt: initialValues.scheduledPublishAt || null,
  });

  // UI state
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/categories', {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories fetched:', data); // Debug log
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Field handlers
  const handleChange = (field: keyof FormState, value: string | TiptapContent | null) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user makes a change
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Set content specifically for the editor - modified to match React.Dispatch<SetStateAction<>> signature
  const setContent: React.Dispatch<React.SetStateAction<TiptapContent | null>> = (value) => {
    const newContent = typeof value === 'function' ? value(formState.content) : value;
    handleChange('content', newContent);
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formState.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formState.status === 'published' && !formState.content) {
      newErrors.content = 'Content is required for published posts';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await onSubmit(formState);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred during submission');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format categories for the Select component
  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ];

  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' }
  ];

  return {
    // Form state
    formState,
    setFormState,
    
    // Field values for convenience
    title: formState.title,
    description: formState.description,
    category: formState.category,
    tags: formState.tags,
    content: formState.content,
    status: formState.status,
    scheduledPublishAt: formState.scheduledPublishAt,
    
    // UI state
    errors,
    isSubmitting,
    submitError,
    isLoading,
    
    // Options for select fields
    categories,
    categoryOptions,
    statusOptions,
    
    // Handlers
    handleChange,
    setContent,
    handleSubmit,
  };
};