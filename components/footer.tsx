import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "../constants/index.js"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { title as CustomTitle, subtitle as subtitle } from "@/components/primitives";

const Footer = () => {
    return (
        <footer className="flexCenter mb-24 px-10">
            <div className="padding-container max-container flex w-full flex-col gap-14">
                <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
                    <div className="flex flex-wrap gap-10 md:flex-1">
                        <div className="flex flex-col gap-5">
                            <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                                {FOOTER_CONTACT_INFO.links.map((link) => (
                                    <Link
                                        href={link.label === 'Email' ? `mailto:${link.value}` : link.label === 'Phone' ? `tel:${link.value}` : '/'}
                                        key={link.label}
                                        className="flex flex-col"
                                    >
                                        <h2 className={subtitle()}>
                                            {link.label}
                                        </h2>
                                        <h2 className={subtitle()}>
                                            {link.value}
                                        </h2>

                                    </Link>
                                ))}
                            </FooterColumn>
                        </div>
                        <div className="flex flex-col gap-5">
                            <FooterColumn title={SOCIALS.title}>
                                <ul className="regular-14 flex gap-4 text-gray-30">
                                    {SOCIALS.links.map((item) => (
                                        <Link href={item.link} key={item.link} target="_blank" rel="noopener noreferrer">
                                            <Image
                                                color="white"
                                                src={item.icon}
                                                alt="logo"
                                                width={24}
                                                height={24}
                                            ></Image>
                                        </Link>
                                    ))}
                                </ul>
                            </FooterColumn>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
type FooterColumnProps = {
    title: string;
    children: React.ReactNode;
};
const FooterColumn = ({ title, children }: FooterColumnProps) => {
    return (
        <div className="flex flex-col">
            <h2 className={subtitle()}>
                {title}
            </h2>
            <h1 className={CustomTitle()}>{children}&nbsp;</h1>
        </div>
    );
};

export default Footer;
