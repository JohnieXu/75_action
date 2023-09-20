export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      article: {
        Row: {
          created_at: string
          date: string | null
          desc: string | null
          id: number
          issue: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          desc?: string | null
          id?: number
          issue?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          desc?: string | null
          id?: number
          issue?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
