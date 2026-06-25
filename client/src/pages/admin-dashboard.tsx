import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imagekitFileId: string;
  link: string;
  technologies: string[];
  featured: boolean;
  order: number;
  createdAt: string;
}

type ModalMode = 'add' | 'edit' | null;

const EMPTY_FORM = {
  title: '',
  description: '',
  link: '',
  technologies: [] as string[],
  featured: false,
};

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function TechChip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="admin-tech-chip">
      {label}
      {onRemove && (
        <button type="button" onClick={onRemove} className="admin-tech-chip-remove" aria-label={`Remove ${label}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      )}
    </span>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number | string; sub?: string }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">{icon}</div>
      <div className="admin-stat-body">
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
        {sub && <div className="admin-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`admin-toast admin-toast-${type}`} role="status">
      <span className="admin-toast-icon">
        {type === 'success'
          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
      </span>
      {message}
      <button type="button" onClick={onClose} className="admin-toast-close" aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>
  );
}

// ─── Project Modal ────────────────────────────────────────────────────────────

function ProjectModal({
  mode,
  project,
  onClose,
  onSave,
}: {
  mode: ModalMode;
  project: typeof EMPTY_FORM & { _id?: string; imageUrl?: string };
  onClose: () => void;
  onSave: (data: typeof EMPTY_FORM, file: File | null) => Promise<void>;
}) {
  const [form, setForm] = useState({ ...project });
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(project.imageUrl || '');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.link.trim()) e.link = 'Project URL is required';
    else if (!/^https?:\/\//.test(form.link)) e.link = 'Must start with http:// or https://';
    if (form.technologies.length === 0) e.technologies = 'Add at least one technology';
    return e;
  };

  const handleAddTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm(f => ({ ...f, technologies: [...f.technologies, t] }));
      setErrors(e => ({ ...e, technologies: '' }));
    }
    setTechInput('');
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); }
    if (e.key === 'Backspace' && !techInput && form.technologies.length > 0)
      setForm(f => ({ ...f, technologies: f.technologies.slice(0, -1) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      
      const f = e.dataTransfer?.files?.[0];
      if (f && f.type.startsWith('image/')) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
      } else if (f) {
        alert('Please drop an image file (PNG, JPG, GIF, WebP)');
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form, file);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {isDragging && (
        <div className="admin-dropzone-global">
          <div className="admin-dropzone-global-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <h2>Drop image to upload</h2>
          </div>
        </div>
      )}
      
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div className="admin-modal-title-row">
            <div className="admin-modal-icon">
              {mode === 'add'
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
            </div>
            <h2 className="admin-modal-title">{mode === 'add' ? 'Add New Project' : 'Edit Project'}</h2>
          </div>
          <button type="button" onClick={onClose} className="admin-modal-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form" noValidate>
          <div className="admin-modal-body" data-lenis-prevent>

            {/* Image upload */}
            <div className="admin-form-group">
              <label className="admin-form-label">Project Image / GIF</label>
              <div className="admin-img-upload-area" onClick={() => fileRef.current?.click()}>
                {preview ? (
                  <img src={preview} alt="preview" className="admin-img-preview" />
                ) : (
                  <div className="admin-img-upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    <span>Click to upload image or GIF</span>
                    <span className="admin-img-upload-hint">PNG, JPG, GIF, WebP — max 10 MB</span>
                  </div>
                )}
                {preview && (
                  <div className="admin-img-upload-overlay">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    Replace image
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="admin-img-file-input" onChange={handleFileChange} aria-label="Upload project image" />
              {mode === 'edit' && !file && project.imageUrl && (
                <span className="admin-form-hint">Current image shown — upload to replace</span>
              )}
            </div>

            {/* Title */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="modal-title">Project Title <span className="admin-required">*</span></label>
              <input id="modal-title" type="text" value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: '' })); }} placeholder="e.g. My Awesome App" className={`admin-input ${errors.title ? 'admin-input-error' : ''}`} />
              {errors.title && <span className="admin-field-error">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="modal-desc">Description <span className="admin-required">*</span></label>
              <textarea id="modal-desc" rows={3} value={form.description} onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: '' })); }} placeholder="Brief description…" className={`admin-textarea ${errors.description ? 'admin-input-error' : ''}`} />
              {errors.description && <span className="admin-field-error">{errors.description}</span>}
            </div>

            {/* Link */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="modal-link">Project URL <span className="admin-required">*</span></label>
              <input id="modal-link" type="url" value={form.link} onChange={e => { setForm(f => ({ ...f, link: e.target.value })); setErrors(er => ({ ...er, link: '' })); }} placeholder="https://…" className={`admin-input ${errors.link ? 'admin-input-error' : ''}`} />
              {errors.link && <span className="admin-field-error">{errors.link}</span>}
            </div>

            {/* Technologies */}
            <div className="admin-form-group">
              <label className="admin-form-label">Technologies <span className="admin-required">*</span></label>
              <div className={`admin-tech-input-wrap ${errors.technologies ? 'admin-input-error' : ''}`}>
                {form.technologies.map(t => (
                  <TechChip key={t} label={t} onRemove={() => setForm(f => ({ ...f, technologies: f.technologies.filter(x => x !== t) }))} />
                ))}
                <input
                  type="text"
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                  onBlur={handleAddTech}
                  placeholder={form.technologies.length === 0 ? 'Type and press Enter…' : 'Add more…'}
                  className="admin-tech-text-input"
                />
              </div>
              {errors.technologies && <span className="admin-field-error">{errors.technologies}</span>}
              <span className="admin-form-hint">Press Enter or Tab to add each tag</span>
            </div>

            {/* Featured toggle */}
            <div className="admin-form-group admin-form-toggle-row">
              <div>
                <div className="admin-form-label">Featured Project</div>
                <div className="admin-form-hint-inline">Featured projects appear highlighted in the portfolio</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.featured}
                onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className={`admin-toggle ${form.featured ? 'admin-toggle-on' : ''}`}
              >
                <span className="admin-toggle-knob" />
              </button>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="admin-modal-cancel-btn" disabled={saving}>Cancel</button>
            <button type="submit" className="admin-modal-save-btn" disabled={saving} id="admin-save-project-btn">
              {saving ? (
                <><span className="admin-btn-spinner" />Saving…</>
              ) : (
                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>{mode === 'add' ? 'Add Project' : 'Save Changes'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteModal({ project, onClose, onConfirm, deleting }: { project: Project; onClose: () => void; onConfirm: () => void; deleting: boolean }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-modal admin-modal-sm">
        <div className="admin-delete-modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h2 className="admin-delete-modal-title">Delete Project?</h2>
        <p className="admin-delete-modal-body">
          Are you sure you want to delete <strong>"{project.title}"</strong>?
          {project.imageUrl && ' The uploaded image will also be deleted from ImageKit.'}
          {' '}This action cannot be undone.
        </p>
        <div className="admin-modal-footer">
          <button type="button" onClick={onClose} className="admin-modal-cancel-btn" disabled={deleting}>Cancel</button>
          <button type="button" onClick={onConfirm} className="admin-modal-delete-btn" disabled={deleting} id="admin-confirm-delete-btn">
            {deleting ? <><span className="admin-btn-spinner" />Deleting…</> : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>Delete Project</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const qc = useQueryClient();

  const [search, setSearch] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Auth check ──────────────────────────────────────────────────────────────
  const { isError: isAuthError, isLoading: isAuthLoading } = useQuery({
    queryKey: ['/api/admin/me'],
    queryFn: () => apiFetch('/api/admin/me'),
    retry: false,
    throwOnError: false,
  });

  useEffect(() => {
    if (isAuthError) {
      navigate('/admin');
    }
  }, [isAuthError, navigate]);

  // ── Fetch projects ──────────────────────────────────────────────────────────
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/admin/projects'],
    queryFn: () => apiFetch('/api/admin/projects'),
    retry: false,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Mutations ───────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (data: typeof EMPTY_FORM) =>
      apiFetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/admin/projects'] }); qc.invalidateQueries({ queryKey: ['/api/projects'] }); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof EMPTY_FORM> }) =>
      apiFetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/admin/projects'] }); qc.invalidateQueries({ queryKey: ['/api/projects'] }); },
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      const fd = new FormData();
      fd.append('image', file);
      return apiFetch(`/api/admin/projects/${id}/image`, { method: 'POST', body: fd });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/admin/projects'] }); qc.invalidateQueries({ queryKey: ['/api/projects'] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/admin/projects/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/admin/projects'] }); qc.invalidateQueries({ queryKey: ['/api/projects'] }); },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiFetch('/api/admin/logout', { method: 'POST' }),
    onSuccess: () => navigate('/admin'),
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSave = async (data: typeof EMPTY_FORM, file: File | null) => {
    try {
      if (modalMode === 'add') {
        const res = await createMutation.mutateAsync(data);
        // Upload image if one was selected
        if (file && res.project?._id) {
          await uploadImageMutation.mutateAsync({ id: res.project._id, file });
        }
        showToast(`"${data.title}" added successfully`);
      } else if (modalMode === 'edit' && editingProject) {
        await updateMutation.mutateAsync({ id: editingProject._id, data });
        if (file) {
          await uploadImageMutation.mutateAsync({ id: editingProject._id, file });
        }
        showToast(`"${data.title}" updated successfully`);
      }
      setModalMode(null);
      setEditingProject(null);
    } catch (err: any) {
      showToast(err.message || 'Something went wrong', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    try {
      await deleteMutation.mutateAsync(deletingProject._id);
      showToast(`"${deletingProject.title}" deleted`, 'error');
      setDeletingProject(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  // ── Filtered list ───────────────────────────────────────────────────────────

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filterFeatured === 'all' || (filterFeatured === 'featured' ? p.featured : !p.featured);
    return matchSearch && matchFilter;
  });

  const featuredCount = projects.filter(p => p.featured).length;
  const techsUsed = new Set(projects.flatMap(p => p.technologies)).size;

  if (isAuthLoading) {
    return (
      <div className="admin-loading-screen">
        <span className="admin-btn-spinner" style={{ width: 32, height: 32, borderTopColor: 'var(--color-brand)', opacity: 0.5 }} />
      </div>
    );
  }

  if (isAuthError) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L0 12L12 24L24 12L12 0ZM12 4.2L4.2 12L12 19.8L19.8 12L12 4.2Z" />
            </svg>
          </div>
          <div>
            <div className="admin-sidebar-brand">ATIF</div>
            <div className="admin-sidebar-role">Admin Dashboard</div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-sidebar-nav-section-label">Content</div>
          <button type="button" className="admin-sidebar-nav-item admin-sidebar-nav-item-active" id="admin-nav-projects">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Projects
            <span className="admin-sidebar-badge">{projects.length}</span>
          </button>
          <button type="button" className="admin-sidebar-nav-item admin-sidebar-nav-item-disabled" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Profile<span className="admin-sidebar-soon">Soon</span>
          </button>
          <button type="button" className="admin-sidebar-nav-item admin-sidebar-nav-item-disabled" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Testimonials<span className="admin-sidebar-soon">Soon</span>
          </button>
          <button type="button" className="admin-sidebar-nav-item admin-sidebar-nav-item-disabled" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Analytics<span className="admin-sidebar-soon">Soon</span>
          </button>
          <div className="admin-sidebar-nav-section-label" style={{ marginTop: '1rem' }}>Settings</div>
          <button type="button" className="admin-sidebar-nav-item admin-sidebar-nav-item-disabled" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings<span className="admin-sidebar-soon">Soon</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar-view-site">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Portfolio
          </a>
          <button type="button" onClick={() => logoutMutation.mutate()} className="admin-sidebar-logout" id="admin-logout-btn" disabled={logoutMutation.isPending}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {logoutMutation.isPending ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      {/* Main */}
      <main className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button type="button" className="admin-hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="admin-topbar-title">Projects Manager</div>
          <div className="admin-topbar-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-topbar-view-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span className="admin-topbar-view-label">Portfolio</span>
            </a>
            <div className="admin-topbar-avatar">A</div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {/* Stats */}
          <div className="admin-stats-row">
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>} label="Total Projects" value={isLoading ? '…' : projects.length} sub="In your portfolio" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>} label="Featured" value={isLoading ? '…' : featuredCount} sub="Highlighted in carousel" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>} label="Technologies" value={isLoading ? '…' : techsUsed} sub="Unique tech stack items" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>} label="With Images" value={isLoading ? '…' : projects.filter(p => p.imageUrl).length} sub="Uploaded to ImageKit" />
          </div>

          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-search-wrap">
              <span className="admin-search-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></span>
              <input id="admin-search" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects, tech…" className="admin-search-input" />
            </div>
            <div className="admin-filter-group">
              {(['all', 'featured', 'regular'] as const).map(f => (
                <button key={f} type="button" onClick={() => setFilterFeatured(f)} className={`admin-filter-btn ${filterFeatured === f ? 'admin-filter-btn-active' : ''}`}>
                  {f === 'all' ? 'All' : f === 'featured' ? '⭐ Featured' : 'Regular'}
                </button>
              ))}
            </div>
            <button type="button" id="admin-add-project-btn" onClick={() => { setEditingProject(null); setModalMode('add'); }} className="admin-add-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Project
            </button>
          </div>

          {search && <div className="admin-result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<strong>{search}</strong>"</div>}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="admin-projects-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="admin-project-card">
                  <div style={{ height: 175, background: 'var(--color-accent-bg)', animation: 'works-shimmer 1.6s ease-in-out infinite', backgroundSize: '200% 100%' }} />
                  <div className="admin-project-card-body" style={{ gap: '0.75rem' }}>
                    <div className="works-skeleton-line w-3/4" style={{ height: 16 }} />
                    <div className="works-skeleton-line w-full" style={{ height: 12 }} />
                    <div className="works-skeleton-line w-5/6" style={{ height: 12 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              </div>
              <h3 className="admin-empty-title">No projects found</h3>
              <p className="admin-empty-body">{search ? 'Try a different search term.' : 'Add your first project to get started.'}</p>
              {!search && (
                <button type="button" onClick={() => { setEditingProject(null); setModalMode('add'); }} className="admin-add-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  Add First Project
                </button>
              )}
            </div>
          )}

          {/* Projects grid */}
          {!isLoading && filtered.length > 0 && (
            <div className="admin-projects-grid">
              {filtered.map(project => (
                <div key={project._id} className="admin-project-card">
                  <div className="admin-project-card-img-wrap">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="admin-project-card-img" loading="lazy" />
                    ) : (
                      <div className="admin-project-card-img-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'Poppins, sans-serif', marginTop: 4 }}>No image</span>
                      </div>
                    )}
                    {project.featured && (
                      <span className="admin-project-featured-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="admin-star-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="admin-project-card-body">
                    <div className="admin-project-card-header">
                      <h3 className="admin-project-card-title">{project.title}</h3>
                      <div className="admin-project-card-actions">
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="admin-project-action-btn admin-action-view" aria-label={`Visit ${project.title}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </a>
                        <button type="button" onClick={() => { setEditingProject(project); setModalMode('edit'); }} className="admin-project-action-btn admin-action-edit" aria-label={`Edit ${project.title}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button type="button" onClick={() => setDeletingProject(project)} className="admin-project-action-btn admin-action-delete" aria-label={`Delete ${project.title}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                        </button>
                      </div>
                    </div>
                    <p className="admin-project-card-desc">{project.description}</p>
                    <div className="admin-project-card-techs">
                      {project.technologies.slice(0, 4).map(t => <TechChip key={t} label={t} />)}
                      {project.technologies.length > 4 && <span className="admin-tech-more">+{project.technologies.length - 4}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {modalMode && (
        <ProjectModal
          mode={modalMode}
          project={editingProject
            ? { title: editingProject.title, description: editingProject.description, link: editingProject.link, technologies: [...editingProject.technologies], featured: editingProject.featured, _id: editingProject._id, imageUrl: editingProject.imageUrl }
            : { ...EMPTY_FORM }}
          onClose={() => { setModalMode(null); setEditingProject(null); }}
          onSave={handleSave}
        />
      )}

      {deletingProject && (
        <DeleteModal
          project={deletingProject}
          onClose={() => setDeletingProject(null)}
          onConfirm={handleConfirmDelete}
          deleting={deleteMutation.isPending}
        />
      )}

      {toast && (
        <div className="admin-toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
