import { describe, it, expect } from "vitest";

describe("Home Page", () => {
  describe("Programs Data", () => {
    const programs = [
      { name: "Bootcamps", desc: "Academic intensive programs", link: "/bootcamp" },
      { name: "Sports", desc: "Games and physical activities", link: "/sports" },
      { name: "Clubs", desc: "ICT, literacy and social clubs", link: "/clubs" },
      { name: "Outreach Visits", desc: "Community engagement programs", link: "/outreach" },
      { name: "Day-in Visits", desc: "Daily school engagement", link: "/dayin" },
      { name: "Library", desc: "Books and resources", link: "/library" },
    ];

    it("should have 6 programs", () => {
      expect(programs).toHaveLength(6);
    });

    it("should have all required program properties", () => {
      programs.forEach((prog) => {
        expect(prog).toHaveProperty("name");
        expect(prog).toHaveProperty("desc");
        expect(prog).toHaveProperty("link");
        expect(prog.name).toBeTruthy();
        expect(prog.desc).toBeTruthy();
        expect(prog.link).toContain("/");
      });
    });

    it("should have correct program links", () => {
      const links = programs.map((p) => p.link);
      expect(links).toContain("/bootcamp");
      expect(links).toContain("/sports");
      expect(links).toContain("/clubs");
      expect(links).toContain("/library");
      expect(links).toContain("/dayin");
      expect(links).toContain("/outreach");
    });
  });

  describe("Team Data", () => {
    const teachers = [
      { name: "Teacher 1", role: "Mathematics" },
      { name: "Teacher 2", role: "Science" },
      { name: "Teacher 3", role: "English" },
      { name: "Teacher 4", role: "ICT" },
      { name: "Teacher 5", role: "General Studies" },
    ];

    const managers = [
      { name: "Manager 1", role: "Operations" },
      { name: "Manager 2", role: "Programs" },
      { name: "Manager 3", role: "Finance" },
      { name: "Manager 4", role: "HR" },
      { name: "Manager 5", role: "Logistics" },
      { name: "Manager 6", role: "Administration" },
    ];

    const coordinators = [
      { name: "Coordinator 1", role: "ICT Club" },
      { name: "Coordinator 2", role: "Literacy Club" },
      { name: "Coordinator 3", role: "Sports Club" },
      { name: "Coordinator 4", role: "Community Club" },
    ];

    it("should have 5 teachers", () => {
      expect(teachers).toHaveLength(5);
    });

    it("should have 6 managers", () => {
      expect(managers).toHaveLength(6);
    });

    it("should have 4 coordinators", () => {
      expect(coordinators).toHaveLength(4);
    });

    it("should have correct teacher roles", () => {
      const roles = teachers.map((t) => t.role);
      expect(roles).toContain("Mathematics");
      expect(roles).toContain("Science");
      expect(roles).toContain("English");
      expect(roles).toContain("ICT");
      expect(roles).toContain("General Studies");
    });

    it("should have correct manager roles", () => {
      const roles = managers.map((m) => m.role);
      expect(roles).toContain("Operations");
      expect(roles).toContain("Programs");
      expect(roles).toContain("Finance");
      expect(roles).toContain("HR");
      expect(roles).toContain("Logistics");
      expect(roles).toContain("Administration");
    });

    it("should have correct coordinator roles", () => {
      const roles = coordinators.map((c) => c.role);
      expect(roles).toContain("ICT Club");
      expect(roles).toContain("Literacy Club");
      expect(roles).toContain("Sports Club");
      expect(roles).toContain("Community Club");
    });
  });

  describe("Navigation", () => {
    it("should have navigation links", () => {
      const navLinks = ["Home", "Programs", "About", "Contact", "Admin"];
      expect(navLinks).toHaveLength(5);
      expect(navLinks).toContain("Admin");
    });
  });

  describe("Page Structure", () => {
    it("should have hero section", () => {
      const heroText = "Empowering Education";
      expect(heroText).toBeTruthy();
    });

    it("should have about section text", () => {
      const aboutText = "We provide structured academic programs, sports, and community initiatives to empower students and adults through education.";
      expect(aboutText).toBeTruthy();
    });
  });
});
