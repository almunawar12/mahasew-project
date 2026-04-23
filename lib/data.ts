export interface Project {
  id: string | number;
  title: string;
  clientName: string;
  clientAffiliation: string;
  clientLogo: string;
  budget: string;
  deadline: string;
  skills: string[];
  variant: 'featured' | 'standard' | 'flash';
  description?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Build a Landing Page for Research Lab",
    clientName: "Ahmad Sudirman",
    clientAffiliation: "Universitas Indonesia",
    clientLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXP_EJbDSl6K2RSbmcnfSnUTDzH332_VkwlW1EMRUwqGiq2deaJ1ry4he164tKLgkvmtXXh3BD_04kU6wwE-tSzpdyRtzNgtPIchyyMiaGGgmCbZSLjCAHIc1aBl_cfXSsTF8XvV6ZEjJp1VBg8bye1Rq0vG3Li44fx6aocj60POSXewY2F9e3ZUwQMzIR_-U-ozgr9WpoEoe72dXSNAbyMKcMBIldqdOm89j-F4NOnT9DlMZMn_lpDr8Uf9v9t7m4S0YFx2_SHK-8",
    budget: "Rp 2.500.000",
    deadline: "14 Days",
    skills: ["React", "NextJS", "Node.js"],
    variant: "featured"
  },
  {
    id: 2,
    title: "Design Social Media Content for Startup",
    clientName: "Dian Wijaya",
    clientAffiliation: "ITB Bandung",
    clientLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-D9JEmzZ73ELJO6J7fvs6WE-sI1te03ykxpeoB-ns7TPrP-mjNHtlN5jCzE99OAKoJT2Mpu2Ec-6oAj_OihWpQDeXq43fwpBTVuK9gftEFnsDSrkTqDTUSxNWt4bq5d6CTk1mwh7DXNUCTOcsX9EZUcRAA151fiXL3q-Zo12Klmm9iTnFLkWox7RKDKudJebcchZhAMpW_mEoiIIRNTztiU9mgNUG9wsAjl2oY8_MpXJzhmpmnfvobcfD9EzrqAD6wUz5RS5Muf6e",
    budget: "Rp 1.200.000",
    deadline: "7 Days",
    skills: ["Figma", "Canva"],
    variant: "standard"
  },
  {
    id: 3,
    title: "Data Cleaning & Visualization Project",
    clientName: "Siti Aminah",
    clientAffiliation: "UGM Yogyakarta",
    clientLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVKoVgH5wH1RGMbwLy_COfv5BV5fNueFvjxo4C1bY14jeoQFaGlzfsM3NuOWbwZYXv_Ze3hm03G9TflrhMe3GK95_iDH877KA2wo5K7GSh2MFqZ5sKbDVXWe38CgMHkjaAO2-iMbwRy-uBso9OuTVboTnPT6UjU5UfjGqnPVxcPk77AUYeVLCiR8oeeUwE55iO5Y9Hd_EzZ2E_gu-eSbWRt8vPcqthloqs9cCpDeGXhD1wZ45jAD8l8j7l8-TlvwI1SYpkb4B_dfsC",
    budget: "Rp 800.000",
    deadline: "5 Days",
    skills: ["Python", "Excel"],
    variant: "standard"
  },
  {
    id: 4,
    title: "Mobile App Bug Fixing (Flutter)",
    clientName: "Rini Astuti",
    clientAffiliation: "BINUS University",
    clientLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMdPtAXw-Yjn1xHr4ZueqSfGgqjl4dcTzvgaOv0LYpS_HMLtHL2iWSeYkbxOQ-eYdGscKpc8HrJ2QQg4AuRgvQp17L5LTgfSmIyObnRFIlaAQvdBVGBAP1WpjDWsOMNFuAH27eNiwZ6BGk_aWgAhoVzqLGTp_e5duGG7IyuLAP8NLAluVNTHCVQnSDbaR70HlqHo6v88gPCqSiXk9_CHaqp8tCMXmbja3ydSF0Ff7UsJyQKl7-44wtC_v6skXR4mhhRbdymtSJiOi5",
    budget: "Rp 1.500.000",
    deadline: "10 Days",
    skills: ["Flutter", "Firebase"],
    variant: "standard"
  },
  {
    id: 5,
    title: "Technical Writing for Tech Blog",
    clientName: "MahaSewa Flash",
    clientAffiliation: "Hot Project",
    clientLogo: "",
    budget: "Rp 500.000",
    deadline: "Flash",
    skills: ["Writing", "Tech"],
    variant: "flash",
    description: "Mencari penulis konten untuk artikel mingguan mengenai perkembangan AI di Indonesia."
  }
];
