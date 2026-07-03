'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import { 
  Building2, MapPin, Coins, FileText, Phone, UploadCloud, 
  CheckCircle2, ArrowRight, Sparkles, Loader2, Info, X, Image as ImageIcon
} from 'lucide-react'

export default function DeposerPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // États du formulaire textuel
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [zone, setZone] = useState('')
  const [propertyType, setPropertyType] = useState('appartement')
  const [transactionType, setTransactionType] = useState('location')
  const [contactPhone, setContactPhone] = useState('')
  
  // États pour la gestion des images réelles
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  // États de l'interface
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Gérer la sélection des fichiers et générer les prévisualisations
  const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      const maxWidth = 1200
      const scale = img.width > maxWidth ? maxWidth / img.width : 1
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
        } else {
          resolve(file)
        }
      }, 'image/jpeg', 0.8)
    }
    img.src = url
  })
}

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const filesArray = Array.from(e.target.files)
    const compressedFiles = await Promise.all(
      filesArray.map(file => compressImage(file))
    )
    setSelectedFiles((prev) => [...prev, ...compressedFiles])
    const newPreviews = compressedFiles.map(file => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...newPreviews])
  }
}

  // Supprimer une image de la liste avant soumission
  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    // Libérer la mémoire de l'URL créée
    URL.revokeObjectURL(previews[index])
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    // 1. Récupérer l'utilisateur AVANT l'insertion
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMsg("Vous devez être connecté pour déposer une annonce.");
      setLoading(false);
      return;
    }

    if (!title || !price || !zone || !contactPhone) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.')
      setLoading(false)
      return
    }

    if (selectedFiles.length === 0) {
      setErrorMsg('Veuillez ajouter au moins une photo.')
      setLoading(false)
      return
    }

    try {
      const uploadedUrls: string[] = []

      // 1. UPLOAD DES IMAGES
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        // CORRECTION : Ajout du slash ici
        const filePath = `listings/${fileName}` 

        const { error: uploadError } = await supabase.storage
          .from('property-images') // Nom exact selon ta capture
          .upload(filePath, file)

        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      // 2. INSERTION
      const { error: insertError } = await supabase
        .from('listings')
        .insert([
          {
            agent_id: user.id, // Utilisateur maintenant défini
            title,
            description,
            price: Number(price),
            zone_saisie: zone,
            property_type: propertyType,
            transaction_type: transactionType,
            contact_phone: contactPhone, // J'ai décommenté cette ligne
            images_urls: uploadedUrls,
            is_boosted: false,
            is_active: true,
            status: 'pending'
          }
        ])

      if (insertError) throw new Error(insertError.message)

      setPreviews([])
      setSelectedFiles([])
      setSuccess(true)

    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-6 antialiased">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-xl shadow-slate-200/50">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">Annonce publiée avec succès !</h1>
          <p className="mt-3 text-sm font-medium text-slate-500 leading-relaxed">
            Vos images ont été stockées de manière sécurisée et votre bien est en ligne sur <span className="font-bold text-slate-800">AURAX</span>.
          </p>
          <div className="mt-8 space-y-2.5">
            <Link href="/biens" className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              Voir le catalogue <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={() => setSuccess(false)} className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl transition-all cursor-pointer">
              Déposer un autre bien
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 antialiased py-12 px-6">
      <div className="mx-auto max-w-3xl">
        
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5" /> Photos réelles & Stockage sécurisé
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Déposer une annonce</h1>
          <p className="mt-2 text-sm font-medium text-slate-500 max-w-md mx-auto">Votre annonce sera enrichie par vos images pour maximiser vos chances de contact.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-sm font-semibold text-rose-800 flex gap-2.5 items-center">
            <Info className="w-4 h-4 text-rose-500 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/60 shadow-xl p-6 sm:p-10 space-y-8">
          
          {/* SECTION 1 : NATURE */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="h-4 w-1 bg-emerald-500 rounded-full" /> 1. Nature du bien
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Type d'offre</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/50">
                  <button type="button" onClick={() => setTransactionType('location')} className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${transactionType === 'location' ? 'bg-white text-slate-950 shadow-xs border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'}`}>À Louer</button>
                  <button type="button" onClick={() => setTransactionType('vente')} className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${transactionType === 'vente' ? 'bg-white text-slate-950 shadow-xs border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'}`}>À Vendre</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Catégorie</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 inset-y-0 h-full w-4 text-slate-400 pointer-events-none" />
                  <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white cursor-pointer transition-all" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="appartement">Appartement</option>
                    <option value="chambre">Chambre</option>
                    <option value="maison">Maison / Villa</option>
                    <option value="terrain">Terrain</option>
                    <option value="bureau">Bureau / Local pro</option>
                  </select>
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 : TEXTES */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="h-4 w-1 bg-emerald-500 rounded-full" /> 2. Détails descriptifs
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Titre de l'annonce <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input type="text" required placeholder="Ex: Bel appartement meublé avec balcon" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-800" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea rows={3} placeholder="Détaillez l'offre (compteur d'électricité, eau de forage, accès, etc.)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-800 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SECTION 3 : FINANCES */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="h-4 w-1 bg-emerald-500 rounded-full" /> 3. Prix & Localisation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Prix demandé (FCFA) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Coins className="absolute left-3.5 inset-y-0 h-full w-4 text-slate-400 pointer-events-none" />
                  <input type="number" required placeholder="Ex: 120000" className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-black text-slate-900" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <span className="absolute right-3.5 inset-y-0 flex items-center text-xs font-bold text-slate-400 pointer-events-none">XOF</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Quartier (Lomé) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 inset-y-0 h-full w-4 text-slate-400 pointer-events-none" />
                  <input type="text" required placeholder="Ex: Agoè, Baguida, Klikame" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-800" value={zone} onChange={(e) => setZone(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 : LE VRAI COMPOSANT D'UPLOAD DE PHOTOS */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="h-4 w-1 bg-emerald-500 rounded-full" /> 4. Galerie Photos & Contact
            </h2>

            <div className="space-y-4">
              {/* Le Dropzone / Zone d'upload Premium */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Photos du bien <span className="text-rose-500">*</span></label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/10 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <UploadCloud className="w-8 h-8 mx-auto text-slate-400 group-hover:text-emerald-600 transition-colors mb-2" />
                  <span className="block text-xs font-bold text-slate-700">Cliquez pour ajouter des photos</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Formats acceptés : JPG, PNG — compression automatique</span>
                </div>
              </div>

              {/* Grille de prévisualisation si des images sont sélectionnées */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                  {previews.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-white">
                      <img src={url} alt="Aperçu" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-slate-900/80 backdrop-blur-xs text-white rounded-md hover:bg-rose-600 transition-colors shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Téléphone de Contact */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700">Numéro WhatsApp / Appel <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 inset-y-0 h-full w-4 text-slate-400 pointer-events-none" />
                  <input type="tel" required placeholder="Ex: +228 90 12 34 56" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* BUTTON SUBMIT */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
            <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Envoi des images et de l'annonce...
                </>
              ) : (
                <>Publier mon annonce gratuitement <ArrowRight className="w-4 h-4 text-white" /></>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}