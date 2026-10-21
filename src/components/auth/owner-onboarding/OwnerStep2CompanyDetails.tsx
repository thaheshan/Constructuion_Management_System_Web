'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updateCompanyDetails,
  setStep,
  saveDraftSuccess,
} from '@/store/slices/ownerOnboardingSlice';
import { DistrictSelector } from './DistrictSelector';
import { LogoUploadZone } from './LogoUploadZone';
import { SaveDraftModal } from './SaveDraftModal';
import { BUSINESS_TYPES, BusinessType, SriLankanDistrict } from '@/types/onboarding';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

export const OwnerStep2CompanyDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const companyDetails = useAppSelector(
    (state) => state.ownerOnboarding.companyDetails
  );
  const ownerDetails = useAppSelector(
    (state) => state.ownerOnboarding.ownerDetails
  );

  // Form local state
  const [companyName, setCompanyName] = useState(companyDetails.companyName || '');
  const [businessType, setBusinessType] = useState<BusinessType | ''>(
    companyDetails.businessType || 'Private Limited Company (Pvt Ltd)'
  );
  const [businessRegNo, setBusinessRegNo] = useState(
    companyDetails.businessRegNo || ''
  );
  const [companyPhonePrefix, setCompanyPhonePrefix] = useState(
    companyDetails.companyPhonePrefix || '+94'
  );
  const [companyPhone, setCompanyPhone] = useState(
    companyDetails.companyPhone || ''
  );
  const [companyEmail, setCompanyEmail] = useState(
    companyDetails.companyEmail || ''
  );
  const [addressLine, setAddressLine] = useState(
    companyDetails.addressLine || ''
  );
  const [city, setCity] = useState(companyDetails.city || '');
  const [district, setDistrict] = useState<SriLankanDistrict | ''>(
    companyDetails.district || 'Colombo'
  );

  // Tax & Statutory
  const [vatTinNumber, setVatTinNumber] = useState(
    companyDetails.vatTinNumber || ''
  );
  const [epfEmployerNo, setEpfEmployerNo] = useState(
    companyDetails.epfEmployerNo || ''
  );
  const [etfEmployerNo, setEtfEmployerNo] = useState(
    companyDetails.etfEmployerNo || ''
  );
  const [isVatRegistered, setIsVatRegistered] = useState(
    companyDetails.isVatRegistered || false
  );
  const [taxSectionExpanded, setTaxSectionExpanded] = useState(true);

  // Preferences & Assets
  const [currency, setCurrency] = useState(
    companyDetails.currency || 'LKR Rs. (Sri Lankan Rupee)'
  );
  const [financialYearStart, setFinancialYearStart] = useState(
    companyDetails.financialYearStart || '1 April'
  );
  const [logoBase64, setLogoBase64] = useState<string | undefined>(
    companyDetails.logoBase64
  );
  const [logoFileName, setLogoFileName] = useState<string | undefined>(
    companyDetails.logoFileName
  );

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Save draft modal state
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!companyName.trim()) {
      errs.companyName = 'Company name is required';
    } else if (companyName.trim().length < 2) {
      errs.companyName = 'Company name must be at least 2 characters';
    }

    if (!businessType) {
      errs.businessType = 'Please select a business entity type';
    }

    const cleanCompanyPhone = companyPhone.replace(/\s+/g, '');
    if (!cleanCompanyPhone) {
      errs.companyPhone = 'Company phone number is required';
    } else if (!/^[0-9]{8,10}$/.test(cleanCompanyPhone)) {
      errs.companyPhone = 'Enter a valid landline or mobile number (e.g. 11 234 5678)';
    }

    if (companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail.trim())) {
      errs.companyEmail = 'Please enter a valid company email address';
    }

    if (!addressLine.trim()) {
      errs.addressLine = 'Office street address is required';
    }

    if (!city.trim()) {
      errs.city = 'City is required';
    }

    if (!district) {
      errs.district = 'Please select a district';
    }

    // Optional field formats if provided
    if (businessRegNo && !/^[A-Za-z0-9\-/]+$/.test(businessRegNo.trim())) {
      errs.businessRegNo = 'Business Registration Number contains invalid characters';
    }

    if (vatTinNumber && !/^[A-Za-z0-9\-]+$/.test(vatTinNumber.trim())) {
      errs.vatTinNumber = 'VAT/TIN format is invalid (e.g. 123456789-8000)';
    }

    return errs;
  };

  const syncToRedux = () => {
    dispatch(
      updateCompanyDetails({
        companyName: companyName.trim(),
        businessType: businessType as BusinessType,
        businessRegNo: businessRegNo.trim(),
        companyPhonePrefix,
        companyPhone: companyPhone.trim(),
        companyEmail: companyEmail.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        district: district as SriLankanDistrict,
        vatTinNumber: vatTinNumber.trim(),
        epfEmployerNo: epfEmployerNo.trim(),
        etfEmployerNo: etfEmployerNo.trim(),
        isVatRegistered,
        currency,
        financialYearStart,
        logoBase64,
        logoFileName,
      })
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      companyName: true,
      businessType: true,
      companyPhone: true,
      addressLine: true,
      city: true,
      district: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      syncToRedux();
      dispatch(setStep(3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    syncToRedux();
    dispatch(setStep(1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = () => {
    syncToRedux();
    const timestamp = new Date().toISOString();
    setSavedTimestamp(timestamp);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const draftPayload = {
          currentStep: 2,
          ownerDetails,
          companyDetails: {
            companyName: companyName.trim(),
            businessType,
            businessRegNo: businessRegNo.trim(),
            companyPhonePrefix,
            companyPhone: companyPhone.trim(),
            companyEmail: companyEmail.trim(),
            addressLine: addressLine.trim(),
            city: city.trim(),
            district,
            vatTinNumber: vatTinNumber.trim(),
            epfEmployerNo: epfEmployerNo.trim(),
            etfEmployerNo: etfEmployerNo.trim(),
            isVatRegistered,
            currency,
            financialYearStart,
            logoBase64,
            logoFileName,
          },
          lastSavedAt: timestamp,
        };
        localStorage.setItem(
          'futura_owner_onboarding_draft',
          JSON.stringify(draftPayload)
        );
        dispatch(saveDraftSuccess());
        setShowDraftModal(true);
      } catch (err) {
        console.error('Failed to save onboarding draft to localStorage', err);
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden p-6 sm:p-10">
      {/* ── Badge & Header ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wide uppercase mb-3.5">
          <Building2 className="w-3.5 h-3.5 text-futura-600" />
          <span>Registering as: Owner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tell us about your company
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          These details appear on official client invoices, payslips, and statutory tax documents. You can update them at any time in Settings.
        </p>
      </div>

      <form onSubmit={handleContinue} noValidate className="space-y-8">
        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 1: BUSINESS INFORMATION */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Business Information
            </h2>
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Company Name <span className="text-futura-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={() => handleBlur('companyName')}
                placeholder="e.g. Perera & Sons Construction (Pvt) Ltd"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.companyName && errors.companyName
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-300 text-slate-900 hover:border-slate-400'
                }`}
              />
            </div>
            {touched.companyName && errors.companyName && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.companyName}</span>
              </p>
            )}
          </div>

          {/* Business Type & Reg No Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Business Type */}
            <div>
              <label
                htmlFor="businessType"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Business Type <span className="text-futura-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                  onBlur={() => handleBlur('businessType')}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium border appearance-none transition focus:outline-none focus:ring-2 focus:ring-futura-500 cursor-pointer ${
                    touched.businessType && errors.businessType
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                      : 'border-slate-300 text-slate-900 hover:border-slate-400'
                  }`}
                >
                  <option value="" disabled>
                    Select entity type...
                  </option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              {touched.businessType && errors.businessType && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.businessType}</span>
                </p>
              )}
            </div>

            {/* Business Reg No */}
            <div>
              <label
                htmlFor="businessRegNo"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Business Reg No <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  id="businessRegNo"
                  type="text"
                  value={businessRegNo}
                  onChange={(e) => setBusinessRegNo(e.target.value)}
                  placeholder="e.g. PV-123456"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium border border-slate-300 text-slate-900 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-futura-500"
                />
              </div>
            </div>
          </div>

          {/* Company Phone & Company Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Phone */}
            <div>
              <label
                htmlFor="companyPhone"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Company Phone <span className="text-futura-500">*</span>
              </label>
              <div className="flex rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-1.5 px-3.5 py-3 bg-slate-100 border border-r-0 border-slate-300 text-slate-700 text-sm font-bold select-none">
                  <span>🇱🇰</span>
                  <span>+94</span>
                </div>
                <input
                  id="companyPhone"
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  onBlur={() => handleBlur('companyPhone')}
                  placeholder="11 234 5678"
                  className={`w-full px-4 py-3 rounded-r-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                    touched.companyPhone && errors.companyPhone
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                      : 'border-slate-300 text-slate-900 hover:border-slate-400'
                  }`}
                />
              </div>
              {touched.companyPhone && errors.companyPhone && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.companyPhone}</span>
                </p>
              )}
            </div>

            {/* Company Email */}
            <div>
              <label
                htmlFor="companyEmail"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Company Email <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  onBlur={() => handleBlur('companyEmail')}
                  placeholder="contact@futura.lk"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                    touched.companyEmail && errors.companyEmail
                      ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                      : 'border-slate-300 text-slate-900 hover:border-slate-400'
                  }`}
                />
              </div>
              {touched.companyEmail && errors.companyEmail && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.companyEmail}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 2: OFFICE ADDRESS */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Office Address
            </h2>
          </div>

          {/* Address Line */}
          <div>
            <label
              htmlFor="addressLine"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Address Line <span className="text-futura-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="addressLine"
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                onBlur={() => handleBlur('addressLine')}
                placeholder="e.g. 142/A, Galle Road"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.addressLine && errors.addressLine
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-300 text-slate-900 hover:border-slate-400'
                }`}
              />
            </div>
            {touched.addressLine && errors.addressLine && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.addressLine}</span>
              </p>
            )}
          </div>

          {/* City and District Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                City <span className="text-futura-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={() => handleBlur('city')}
                placeholder="e.g. Colombo 03"
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.city && errors.city
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-300 text-slate-900 hover:border-slate-400'
                }`}
              />
              {touched.city && errors.city && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                District <span className="text-futura-500">*</span>
              </label>
              <DistrictSelector
                value={district}
                onChange={(selected) => {
                  setDistrict(selected);
                  setTouched((prev) => ({ ...prev, district: true }));
                }}
                error={touched.district ? errors.district : undefined}
              />
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 3: TAX & STATUTORY DETAILS (COLLAPSIBLE) */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => setTaxSectionExpanded(!taxSectionExpanded)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-100/60 transition cursor-pointer"
          >
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>Tax & Statutory Details</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                  Optional
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Required for IRD compliance, ETF/EPF labour contributions, and statutory invoicing.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
              {taxSectionExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {taxSectionExpanded && (
            <div className="p-4 sm:p-6 pt-2 border-t border-slate-200 bg-white space-y-5">
              {/* VAT / TIN Number */}
              <div>
                <label
                  htmlFor="vatTin"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  VAT / TIN Number
                </label>
                <input
                  id="vatTin"
                  type="text"
                  value={vatTinNumber}
                  onChange={(e) => setVatTinNumber(e.target.value)}
                  placeholder="e.g. 123456789-8000"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-slate-300 text-slate-900 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-futura-500"
                />
              </div>

              {/* EPF & ETF Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="epfNo"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    EPF Employer Number
                  </label>
                  <input
                    id="epfNo"
                    type="text"
                    value={epfEmployerNo}
                    onChange={(e) => setEpfEmployerNo(e.target.value)}
                    placeholder="e.g. EPF/12345/A"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-slate-300 text-slate-900 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-futura-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="etfNo"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    ETF Employer Number
                  </label>
                  <input
                    id="etfNo"
                    type="text"
                    value={etfEmployerNo}
                    onChange={(e) => setEtfEmployerNo(e.target.value)}
                    placeholder="e.g. ETF/67890/B"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-slate-300 text-slate-900 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-futura-500"
                  />
                </div>
              </div>

              {/* VAT Registered Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    VAT Registered Business
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enable if your company is registered for VAT with Sri Lanka Inland Revenue.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVatRegistered(!isVatRegistered)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                    isVatRegistered ? 'bg-futura-500' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={isVatRegistered}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      isVatRegistered ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 4: PREFERENCES & ASSETS */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Preferences & Branding
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Default Currency
              </label>
              <div className="relative">
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-slate-300 bg-white text-slate-900 appearance-none transition focus:outline-none focus:ring-2 focus:ring-futura-500 cursor-pointer"
                >
                  <option value="LKR Rs. (Sri Lankan Rupee)">
                    LKR Rs. (Sri Lankan Rupee)
                  </option>
                  <option value="USD $ (US Dollar)">USD $ (US Dollar)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Financial Year Start */}
            <div>
              <label
                htmlFor="fyStart"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Financial Year Start
              </label>
              <div className="relative">
                <select
                  id="fyStart"
                  value={financialYearStart}
                  onChange={(e) => setFinancialYearStart(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-slate-300 bg-white text-slate-900 appearance-none transition focus:outline-none focus:ring-2 focus:ring-futura-500 cursor-pointer"
                >
                  <option value="1 April">1 April (Sri Lankan Standard)</option>
                  <option value="1 January">1 January (Calendar Year)</option>
                  <option value="1 July">1 July</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Company Logo Upload Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Company Logo <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <LogoUploadZone
              logoBase64={logoBase64}
              logoFileName={logoFileName}
              onFileSelect={(b64, name) => {
                setLogoBase64(b64);
                setLogoFileName(name);
              }}
              onFileRemove={() => {
                setLogoBase64(undefined);
                setLogoFileName(undefined);
              }}
            />
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* ACTION BUTTONS */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="py-3.5 px-6 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-futura-500/25 transition duration-150 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-futura-600 transition py-1 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save and finish later</span>
            </button>
          </div>
        </div>
      </form>

      {/* Draft Saved Modal */}
      <SaveDraftModal
        isOpen={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        savedTime={savedTimestamp}
      />
    </div>
  );
};
