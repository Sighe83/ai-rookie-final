import { redirect } from 'next/navigation'

export default function SignupPage() {
  // Redirect to home page where they can use the auth modal
  redirect('/')
}