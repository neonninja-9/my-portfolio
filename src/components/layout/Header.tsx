'use client';
import React from 'react';
import { Mail } from 'lucide-react';
import { motion, useMotionValue, AnimatePresence, Variants } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/MenuToggleIcon';
import { useScroll } from "@/hooks/useScroll";
import ThemeSwitch from "@/components/shared/ThemeSwitch";
import { contactInfo } from '@/data/socialLinks';
import '@/components/layout/Header.css';

const links = [
	{ label: 'About', href: '#about' },
	{ label: 'Tech Stack', href: '#tech-stack' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Journey', href: '#journey' },
	{ label: 'Contact', href: '#contact' },
];

const scrollToSection = (href: string) => {
	const target = document.querySelector(href);
	if (!target) return;

	const headerOffset = 100;
	const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
	window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
};

const MENU_SLIDE_ANIMATION = {
	initial: { x: "calc(100% + 100px)" },
	enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
	exit: {
		x: "calc(100% + 100px)",
		transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
	},
};

const CustomFooter: React.FC = () => {
	return (
		<div className="flex w-full text-xs justify-between text-white/70 px-10 md:px-14 pb-8 uppercase tracking-widest font-medium">
			<a href={contactInfo.email ? `mailto:${contactInfo.email}` : "#"} className="hover:text-white transition-colors">
				Email
			</a>
			<div className="flex gap-6">
				<a href="https://github.com/neonninja-9" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
					GitHub
				</a>
				<a href="https://www.linkedin.com/in/gourav-sharma-450298329" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
					LinkedIn
				</a>
			</div>
		</div>
	);
};

interface iNavLinkProps {
	heading: string;
	href: string;
	setIsActive: (isActive: boolean) => void;
	index: number;
	handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const NavLink: React.FC<iNavLinkProps> = ({
	heading,
	href,
	setIsActive,
	index,
	handleNavClick
}) => {
	const ref = React.useRef<HTMLAnchorElement | null>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const handleMouseMove = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => {
		if (!ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		x.set(mouseX / rect.width - 0.5);
		y.set(mouseY / rect.height - 0.5);
	};

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		handleNavClick(e, href);
	};

	return (
		<motion.div
			initial="initial"
			whileHover="whileHover"
			className="group relative flex items-center justify-between border-b border-white/5 py-5 transition-colors duration-500 uppercase"
		>
			<a ref={ref} onMouseMove={handleMouseMove} href={href} onClick={handleClick} className="w-full">
				<div className="relative flex items-start">
					<span className="text-white/30 group-hover:text-white/60 transition-colors duration-500 text-2xl md:text-3xl font-thin mr-4 mt-1">
						0{index}.
					</span>
					<div className="flex flex-row gap-2">
						<motion.span
							variants={{
								initial: { x: 0 },
								whileHover: { x: -12 },
							}}
							transition={{
								type: "spring",
								staggerChildren: 0.05,
								delayChildren: 0.1,
							}}
							className="relative z-10 block text-4xl md:text-5xl font-extralight text-white/90 group-hover:text-white transition-colors duration-500"
						>
							{heading.split("").map((letter, i) => {
								return (
									<motion.span
										key={i}
										variants={{
											initial: { x: 0 },
											whileHover: { x: 12 },
										}}
										transition={{ type: "spring" }}
										className="inline-block"
									>
										{letter === " " ? "\u00A0" : letter}
									</motion.span>
								);
							})}
						</motion.span>
					</div>
				</div>
			</a>
		</motion.div>
	);
};

const Curve: React.FC = () => {
	const initialPath = `M100 0 L200 0 L200 ${window.innerHeight} L100 ${window.innerHeight} Q-100 ${window.innerHeight / 2} 100 0`;
	const targetPath = `M100 0 L200 0 L200 ${window.innerHeight} L100 ${window.innerHeight} Q100 ${window.innerHeight / 2} 100 0`;

	const curve = {
		initial: { d: initialPath },
		enter: {
			d: targetPath,
			transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const },
		},
		exit: {
			d: initialPath,
			transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
		},
	};

	return (
		<svg
			className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full"
			style={{ fill: "#0c0c0e" }}
		>
			<motion.path
				variants={curve}
				initial="initial"
				animate="enter"
				exit="exit"
			/>
		</svg>
	);
};

interface iCurvedNavbarProps {
	setIsActive: (isActive: boolean) => void;
	navItems: typeof links;
	handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
	footer?: React.ReactNode;
}

const CurvedNavbar: React.FC<iCurvedNavbarProps> = ({ setIsActive, navItems, handleNavClick, footer }) => {
	return (
		<motion.div
			variants={MENU_SLIDE_ANIMATION}
			initial="initial"
			animate="enter"
			exit="exit"
			className="h-[100dvh] w-screen max-w-[420px] fixed right-0 top-0 z-[60] bg-[#0c0c0e] shadow-2xl"
		>
			<div className="h-full pt-12 pb-6 flex flex-col justify-between overflow-y-auto">
				<div className="flex flex-col mt-0 px-10 md:px-14">
					<div className="flex items-center justify-between text-white/50 border-b border-white/10 uppercase text-xs tracking-widest pb-6 mb-6">
						<p className="font-medium">Navigation</p>
						<button 
							onClick={() => setIsActive(false)}
							className="p-2 -mr-2 rounded-full hover:bg-white/10 hover:text-white transition-all bg-white/5"
							aria-label="Close menu"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					</div>
					<section className="bg-transparent mt-0">
						<div className="mx-auto w-full flex flex-col">
							{navItems.map((item, index) => {
								return (
									<NavLink
										key={item.href}
										heading={item.label}
										href={item.href}
										setIsActive={setIsActive}
										index={index + 1}
										handleNavClick={handleNavClick}
									/>
								);
							})}
						</div>
					</section>
				</div>
				<div className="mt-12">
					{footer || <CustomFooter />}
				</div>
			</div>
			<Curve />
		</motion.div>
	);
};

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		event.preventDefault();
		setOpen(false);
		scrollToSection(href);
	};

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<>
			<header className="site-header">
				<div
					className={cn(
						'site-header__bar',
						{
							'site-header__bar--scrolled': scrolled && !open,
							'site-header__bar--open': open,
						},
					)}
				>
					<nav className="site-header__nav">
						<a href="#hero" className="site-header__logo-link flex items-center" onClick={(e) => handleNavClick(e, '#hero')}>
							<span className="text-xl font-bold tracking-tight text-white">gourav.dev</span>
						</a>

						<div className="site-header__links">
							{links.map((link) => (
								<a
									key={link.href}
									className="site-header__link"
									href={link.href}
									onClick={(e) => handleNavClick(e, link.href)}
								>
									{link.label}
								</a>
							))}
						</div>

						<div className="site-header__actions">
							<ThemeSwitch />
							<Button
								variant="outline"
								size="sm"
								className="site-header__button border-white/10 transition-colors hover:bg-white/5"
								asChild
							>
								<a href={`mailto:${contactInfo.email}`} aria-label="Send email">
									<Mail className="size-4 shrink-0" />
									Email
								</a>
							</Button>
							<Button
								size="sm"
								className="site-header__button site-header__cta hover:text-white"
								onClick={() => scrollToSection('#contact')}
							>
								Let's Talk
							</Button>
						</div>
						<Button 
							size="icon" 
							variant="outline" 
							onClick={() => setOpen(!open)} 
							className={cn(
								"site-header__menu-button relative z-[70] transition-opacity duration-300",
								open && "opacity-0 pointer-events-none"
							)}
						>
							<MenuToggleIcon open={open} className="size-5" duration={300} />
						</Button>
					</nav>
				</div>
			</header>

			<AnimatePresence mode="wait">
				{open && (
					<>
						<motion.div 
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
							onClick={() => setOpen(false)}
						/>
						<CurvedNavbar
							setIsActive={setOpen}
							navItems={links}
							handleNavClick={handleNavClick}
						/>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

export const WordmarkIcon = (props: React.ComponentProps<"svg">) => (
	<svg viewBox="0 0 84 24" fill="currentColor" {...props}>
		<path d="M45.035 23.984c-1.34-.062-2.566-.441-3.777-1.16-1.938-1.152-3.465-3.187-4.02-5.36-.199-.784-.238-1.128-.234-2.058 0-.691.008-.87.062-1.207.23-1.5.852-2.883 1.852-4.144.297-.371 1.023-1.09 1.41-1.387 1.399-1.082 2.84-1.68 4.406-1.816.536-.047 1.528-.02 2.047.054 1.227.184 2.227.543 3.106 1.121 1.277.84 2.5 2.184 3.367 3.7.098.168.172.308.172.312-.004 0-1.047.723-2.32 1.598l-2.711 1.867c-.61.422-2.91 2.008-2.993 2.062l-.074.047-1-1.574c-.55-.867-1.008-1.594-1.012-1.61-.007-.019.922-.648 2.188-1.476 1.215-.793 2.2-1.453 2.191-1.46-.02-.032-.508-.27-.691-.34a5 5 0 0 0-.465-.13c-.371-.09-1.105-.125-1.426-.07-1.285.219-2.336 1.3-2.777 2.852-.215.761-.242 1.636-.074 2.355.129.527.383 1.102.691 1.543.234.332.727.82 1.047 1.031.664.434 1.195.586 1.969.555.613-.023 1.027-.129 1.64-.426 1.184-.574 2.16-1.554 2.828-2.843.122-.235.208-.372.227-.368.082.032 3.77 1.938 3.79 1.961.034.032-.407.93-.696 1.414a12 12 0 0 1-1.051 1.477c-.36.422-1.102 1.14-1.492 1.445a9.9 9.9 0 0 1-3.23 1.684 9.2 9.2 0 0 1-2.95.351M74.441 23.996c-1.488-.043-2.8-.363-4.066-.992-1.687-.848-2.992-2.14-3.793-3.774-.605-1.234-.863-2.402-.863-3.894.004-1.149.176-2.156.527-3.11.14-.378.531-1.171.75-1.515 1.078-1.703 2.758-2.934 4.805-3.524.847-.242 1.465-.332 2.433-.351 1.032-.024 1.743.055 2.48.277l.31.09.007 2.48c.004 1.364 0 2.481-.008 2.481a1 1 0 0 1-.12-.055c-.688-.347-2.09-.488-2.962-.296-.754.167-1.296.453-1.785.945a3.7 3.7 0 0 0-1.043 2.11c-.047.382-.02 1.109.055 1.437a3.4 3.4 0 0 0 .941 1.738c.75.75 1.715 1.102 2.875 1.05.645-.03 1.118-.14 1.563-.366q1.721-.864 2.02-3.145c.035-.293.042-1.266.042-7.957V0H84l-.012 8.434c-.008 7.851-.011 8.457-.054 8.757-.196 1.274-.586 2.25-1.301 3.243-1.293 1.808-3.555 3.07-6.145 3.437-.664.098-1.43.14-2.047.125M9.848 23.574a14 14 0 0 1-1.137-.152c-2.352-.426-4.555-1.781-6.117-3.774-.27-.335-.75-1.05-.95-1.406-1.156-2.047-1.695-4.27-1.64-6.77.047-1.995.43-3.66 1.23-5.316.524-1.086 1.04-1.87 1.793-2.715C4.567 1.72 6.652.535 8.793.171 9.68.02 10.093 0 12.297 0h1.789v5.441l-.961.016c-2.36.04-3.441.215-4.441.719-.836.414-1.278.879-1.895 1.976-.219.399-.535 1.02-.535 1.063 0 .02 1.285.027 3.918.027h3.914v5.113h-3.914c-2.54 0-3.918.008-3.918.028 0 .05.254.597.441.953.344.656.649 1.086 1.051 1.48.668.657 1.356.985 2.445 1.16.645.106 1.274.145 2.61.16l1.285.016v5.442l-2.055-.004a120 120 0 0 1-2.183-.016M16.469 14.715c0-5.504.011-9.04.031-9.29a5.54 5.54 0 0 1 1.527-3.48c.778-.82 1.922-1.457 3.118-1.734C21.915.035 22.422 0 24.39 0h1.652v4.914h-1.426c-1.324 0-1.445.004-1.644.055-.739.191-1.059.699-1.106 1.754l-.015.355h4.191v4.914h-4.184v11.602h-5.39ZM27.023 14.727c0-5.223.012-9.04.028-9.278.129-1.98 1.234-3.68 3.012-4.62.87-.462 1.777-.716 2.851-.802A61 61 0 0 1 34.945 0h1.649v4.914h-1.426c-1.32 0-1.441.004-1.64.055-.739.191-1.063.699-1.106 1.754l-.02.355h4.192v4.914H32.41v11.602h-5.387ZM55.48 15.406V7.22h4.66v1.363c0 1.3.005 1.363.051 1.363.04 0 .075-.054.133-.203.38-.98.969-1.68 1.711-2.031.563-.266 1.422-.43 2.492-.48l.414-.02v4.914l-.414.035c-.738.063-1.597.195-2.058.313-.297.082-.688.28-.875.449-.324.289-.532.703-.625 1.254-.094.547-.098.879-.098 5.144v4.274h-5.39Zm0 0" />
	</svg>
);
