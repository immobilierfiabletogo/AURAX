'use client'

import { useEffect } from 'react'

import {
  EditorContent,
  useEditor,
} from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo2,
  Redo2,
} from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
}

interface ToolbarButtonProps {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        transition-all
        duration-200

        ${
          active
            ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
            : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
        }

        ${
          disabled
            ? 'cursor-not-allowed opacity-40'
            : ''
        }
      `}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({
  value,
  onChange,
}: Props) {

  const editor = useEditor({

    extensions: [

      StarterKit.configure({

        heading: {
          levels: [1, 2, 3],
        },

      }),

      Underline,

      Link.configure({

        openOnClick: false,

        autolink: true,

        HTMLAttributes: {
          class:
            'text-emerald-600 underline font-semibold',
        },

      }),

      Placeholder.configure({

        placeholder:
          'Décrivez votre bien de manière attractive...',

      }),

    ],

    content: value,

    immediatelyRender: false,

    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },

  })

  useEffect(() => {

    if (!editor) return

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }

  }, [value, editor])

  if (!editor) {
    return null
  }
    return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Toolbar */}

      <div
        className="
          flex
          flex-wrap
          gap-2
          border-b
          border-slate-200
          bg-slate-50
          p-3
        "
      >
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('underline')}
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-10 w-px bg-slate-200" />

        <ToolbarButton
          active={editor.isActive('heading', { level: 1 })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-10 w-px bg-slate-200" />

        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('blockquote')}
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-10 w-px bg-slate-200" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt(
              'Entrez le lien :'
            )

            if (!url) return

            editor
              .chain()
              .focus()
              .setLink({
                href: url,
              })
              .run()
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-10 w-px bg-slate-200" />

        <ToolbarButton
          disabled={!editor.can().undo()}
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor.can().redo()}
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

            {/* Editeur */}

      <EditorContent
        editor={editor}
        className="
          min-h-[320px]

          [&_.ProseMirror]:min-h-[320px]
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:p-6
          [&_.ProseMirror]:text-slate-700
          [&_.ProseMirror]:leading-8
          [&_.ProseMirror]:text-[15px]

          [&_.ProseMirror_h1]:mb-4
          [&_.ProseMirror_h1]:text-3xl
          [&_.ProseMirror_h1]:font-black
          [&_.ProseMirror_h1]:text-slate-900

          [&_.ProseMirror_h2]:mb-4
          [&_.ProseMirror_h2]:text-2xl
          [&_.ProseMirror_h2]:font-black
          [&_.ProseMirror_h2]:text-slate-900

          [&_.ProseMirror_h3]:mb-3
          [&_.ProseMirror_h3]:text-xl
          [&_.ProseMirror_h3]:font-bold
          [&_.ProseMirror_h3]:text-slate-900

          [&_.ProseMirror_p]:mb-4

          [&_.ProseMirror_ul]:mb-4
          [&_.ProseMirror_ul]:list-disc
          [&_.ProseMirror_ul]:pl-6

          [&_.ProseMirror_ol]:mb-4
          [&_.ProseMirror_ol]:list-decimal
          [&_.ProseMirror_ol]:pl-6

          [&_.ProseMirror_li]:mb-2

          [&_.ProseMirror_blockquote]:my-5
          [&_.ProseMirror_blockquote]:border-l-4
          [&_.ProseMirror_blockquote]:border-emerald-500
          [&_.ProseMirror_blockquote]:bg-emerald-50
          [&_.ProseMirror_blockquote]:py-3
          [&_.ProseMirror_blockquote]:pl-5
          [&_.ProseMirror_blockquote]:italic

          [&_.ProseMirror_a]:font-semibold
          [&_.ProseMirror_a]:text-emerald-600
          [&_.ProseMirror_a]:underline

          [&_.ProseMirror_strong]:font-black
          [&_.ProseMirror_em]:italic

          [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none
          [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left
          [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0
          [&_.ProseMirror_.is-editor-empty:first-child::before]:text-slate-400
          [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
        "
      />

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-slate-200
          bg-slate-50
          px-5
          py-3
        "
      >
        <p className="text-xs text-slate-500">
          Utilisez les outils ci-dessus pour mettre votre annonce en valeur.
        </p>

        <span
          className="
            rounded-full
            bg-emerald-100
            px-3
            py-1
            text-xs
            font-bold
            text-emerald-700
          "
        >
          Editeur professionnel
        </span>
      </div>

    </div>
  )
}