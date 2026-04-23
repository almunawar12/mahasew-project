import { auth } from '@/auth';
import { NavbarContent } from './NavbarContent';

export const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  return <NavbarContent user={user} />;
};
