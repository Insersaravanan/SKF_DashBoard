using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace EMaintanance.Models
{
    public partial class SkfDBContext : DbContext
    {
        public SkfDBContext()
        {
        }

        public SkfDBContext(DbContextOptions<SkfDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Client> Client { get; set; }
        public virtual DbSet<ClientSite> ClientSite { get; set; }
        public virtual DbSet<ClientSiteTranslated> ClientSiteTranslated { get; set; }
        public virtual DbSet<ClientTranslated> ClientTranslated { get; set; }
        public virtual DbSet<Cmssetup> Cmssetup { get; set; }
        public virtual DbSet<CostCentre> CostCentre { get; set; }
        public virtual DbSet<CostCentreTranslated> CostCentreTranslated { get; set; }
        public virtual DbSet<Country> Country { get; set; }
        public virtual DbSet<CountryTranslated> CountryTranslated { get; set; }
        public virtual DbSet<Industry> Industry { get; set; }
        public virtual DbSet<IndustryTranslated> IndustryTranslated { get; set; }
        public virtual DbSet<Languages> Languages { get; set; }
        public virtual DbSet<Lookups> Lookups { get; set; }
        public virtual DbSet<LookupTranslated> LookupTranslated { get; set; }
        public virtual DbSet<ProgramRoleRelation> ProgramRoleRelation { get; set; }
        public virtual DbSet<Programs> Programs { get; set; }
        public virtual DbSet<ProgramTranslated> ProgramTranslated { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<RoleGroup> RoleGroup { get; set; }
        public virtual DbSet<RoleGroupRoleRelation> RoleGroupRoleRelation { get; set; }
        public virtual DbSet<RoleGroupTranslated> RoleGroupTranslated { get; set; }
        public virtual DbSet<Sector> Sector { get; set; }
        public virtual DbSet<SectorTranslated> SectorTranslated { get; set; }
        public virtual DbSet<Segment> Segment { get; set; }
        public virtual DbSet<SegmentTranslated> SegmentTranslated { get; set; }
        public virtual DbSet<UserClientSiteRelation> UserClientSiteRelation { get; set; }
        public virtual DbSet<UserRoleGroupRelation> UserRoleGroupRelation { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Client>(entity =>
            {
                entity.Property(e => e.Createdon)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.ClientStatusNavigation)
                    .WithMany(p => p.Client)
                    .HasForeignKey(d => d.ClientStatus)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientStatus_Lookup");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Client)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Client_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.Client)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientCreated_Language");
            });

            modelBuilder.Entity<ClientSite>(entity =>
            {
                entity.Property(e => e.Createdon)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.ClientSiteStatusNavigation)
                    .WithMany(p => p.ClientSite)
                    .HasForeignKey(d => d.ClientSiteStatus)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientSiteStatus_Lookup");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ClientSite)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientSite_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.ClientSite)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientSiteCreated_Language");
            });

            modelBuilder.Entity<ClientSiteTranslated>(entity =>
            {
                entity.HasKey(e => e.ClientSiteTid);

                entity.Property(e => e.ClientSiteTid).HasColumnName("ClientSiteTId");

                entity.Property(e => e.Address1)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Address2)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Country)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.InternalRefId)
                    .IsRequired()
                    .HasMaxLength(75);

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.Pobox)
                    .IsRequired()
                    .HasColumnName("POBox")
                    .HasMaxLength(40);

                entity.Property(e => e.SiteName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.StateName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Zip)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.HasOne(d => d.ClientSite)
                    .WithMany(p => p.ClientSiteTranslated)
                    .HasForeignKey(d => d.ClientSiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientSiteTranslated_Client");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ClientSiteTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientSiteTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.ClientSiteTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientSiteTranslated_Language");
            });

            modelBuilder.Entity<ClientTranslated>(entity =>
            {
                entity.HasKey(e => e.ClientTid);

                entity.Property(e => e.ClientTid).HasColumnName("ClientTId");

                entity.Property(e => e.ClientName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.InternalRefId)
                    .IsRequired()
                    .HasMaxLength(75);

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.ClientTranslated)
                    .HasForeignKey(d => d.ClientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientTranslated_Client");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ClientTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.ClientTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ClientTranslated_Language");
            });

            modelBuilder.Entity<Cmssetup>(entity =>
            {
                entity.HasKey(e => e.Cmsid);

                entity.ToTable("CMSSetup");

                entity.Property(e => e.Cmsid).HasColumnName("CMSId");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.Createdon)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions).HasMaxLength(500);

                entity.Property(e => e.TypeCode)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.TypeName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Cmssetup)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CMSSetup_Users");
            });

            modelBuilder.Entity<CostCentre>(entity =>
            {
                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.CostCentre)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CostCentre_Country");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.CostCentre)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CostCentre_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.CostCentre)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CostCentre_Language");
            });

            modelBuilder.Entity<CostCentreTranslated>(entity =>
            {
                entity.HasKey(e => e.CostCentreTid);

                entity.Property(e => e.CostCentreTid).HasColumnName("CostCentreTId");

                entity.Property(e => e.CostCentreName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions).HasMaxLength(250);

                entity.HasOne(d => d.CostCentre)
                    .WithMany(p => p.CostCentreTranslated)
                    .HasForeignKey(d => d.CostCentreId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CostCentreTranslated_CostCentre");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.CostCentreTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CostCentreTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.CostCentreTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CostCentreTranslated_Language");
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.HasIndex(e => e.CountryCode)
                    .HasName("UK_CountryCode")
                    .IsUnique();

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CountryCode)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Country)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Country_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.Country)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Country_Language");
            });

            modelBuilder.Entity<CountryTranslated>(entity =>
            {
                entity.HasKey(e => e.CountryTid);

                entity.Property(e => e.CountryTid).HasColumnName("CountryTId");

                entity.Property(e => e.CountryName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.CountryTranslated)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CountryTranslated_Country");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.CountryTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CountryTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.CountryTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CountryTranslated_Language");
            });

            modelBuilder.Entity<Industry>(entity =>
            {
                entity.Property(e => e.Active)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.Createdon)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IndustryCode)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Industry)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Industry_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.Industry)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("IndustryCreated_Language");

                entity.HasOne(d => d.Segment)
                    .WithMany(p => p.Industry)
                    .HasForeignKey(d => d.SegmentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Industry_Sector");
            });

            modelBuilder.Entity<IndustryTranslated>(entity =>
            {
                entity.HasKey(e => e.IndustryTid);

                entity.Property(e => e.IndustryTid).HasColumnName("IndustryTId");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions).HasMaxLength(250);

                entity.Property(e => e.IndustryName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.IndustryTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("IndustryTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.IndustryTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("IndustryTranslated_Language");
            });

            modelBuilder.Entity<Languages>(entity =>
            {
                entity.HasKey(e => e.LanguageId);

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CountryCode)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Lname)
                    .IsRequired()
                    .HasColumnName("LName")
                    .HasMaxLength(75);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Languages)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Language_Users");
            });

            modelBuilder.Entity<Lookups>(entity =>
            {
                entity.HasKey(e => e.LookupId);

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.LookupCode)
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Lookups)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Lookup_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.Lookups)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Lookup_Language");
            });

            modelBuilder.Entity<LookupTranslated>(entity =>
            {
                entity.HasKey(e => e.LookupTid);

                entity.Property(e => e.LookupTid).HasColumnName("LookupTId");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions).HasMaxLength(250);

                entity.Property(e => e.Lname)
                    .IsRequired()
                    .HasColumnName("LName")
                    .HasMaxLength(75);

                entity.Property(e => e.Lvalue)
                    .IsRequired()
                    .HasColumnName("LValue")
                    .HasMaxLength(75);

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.LookupTranslated)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("LookupTranslated_Country");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.LookupTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("LookupTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.LookupTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("LookupTranslated_Language");

                entity.HasOne(d => d.Lookup)
                    .WithMany(p => p.LookupTranslated)
                    .HasForeignKey(d => d.LookupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("LookupTranslated_Lookup");
            });

            modelBuilder.Entity<ProgramRoleRelation>(entity =>
            {
                entity.HasKey(e => e.ProrgramRoleRelationId);

                entity.Property(e => e.ProrgramRoleRelationId).HasColumnName("ProrgramRoleRelationID");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ProgramRoleRelation)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ProgramRoleRelation_Users");

                entity.HasOne(d => d.Program)
                    .WithMany(p => p.ProgramRoleRelation)
                    .HasForeignKey(d => d.ProgramId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ProgramRoleRelation_Programs");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.ProgramRoleRelation)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ProgramRoleRelation_Role");
            });

            modelBuilder.Entity<Programs>(entity =>
            {
                entity.HasKey(e => e.ProgramId);

                entity.Property(e => e.ActionName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ControllerName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.CssClassName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.GroupCode)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.IconName)
                    .HasMaxLength(35)
                    .IsUnicode(false);

                entity.Property(e => e.LinkUrl)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ProgramCode)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.Property(e => e.SubGroupCode)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.Programs)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Programs_Country");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Programs)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Programs_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.Programs)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Programs_Language");

                entity.HasOne(d => d.MenuGroup)
                    .WithMany(p => p.Programs)
                    .HasForeignKey(d => d.MenuGroupId)
                    .HasConstraintName("Programs_MenuGroup");
            });

            modelBuilder.Entity<ProgramTranslated>(entity =>
            {
                entity.HasKey(e => e.ProgramTid);

                entity.Property(e => e.ProgramTid).HasColumnName("ProgramTId");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.MenuName).HasMaxLength(75);

                entity.Property(e => e.ProgramName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ProgramTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ProgramTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.ProgramTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ProgramTranslated_Language");

                entity.HasOne(d => d.Program)
                    .WithMany(p => p.ProgramTranslated)
                    .HasForeignKey(d => d.ProgramId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ProgramTranslated_Programs");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Internal)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Role)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Role_Users");
            });

            modelBuilder.Entity<RoleGroup>(entity =>
            {
                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.RoleGroup)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroup_Country");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.RoleGroup)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroup_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.RoleGroup)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroup_Language");
            });

            modelBuilder.Entity<RoleGroupRoleRelation>(entity =>
            {
                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.RoleGroupRoleRelation)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroupRoleRelation_Users");

                entity.HasOne(d => d.RoleGroup)
                    .WithMany(p => p.RoleGroupRoleRelation)
                    .HasForeignKey(d => d.RoleGroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroupRoleRelation_RoleGroup");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.RoleGroupRoleRelation)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroupRoleRelation_Role");
            });

            modelBuilder.Entity<RoleGroupTranslated>(entity =>
            {
                entity.HasKey(e => e.RoleGroupTid);

                entity.Property(e => e.RoleGroupTid).HasColumnName("RoleGroupTId");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.RoleGroupName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.RoleGroupTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroupTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.RoleGroupTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroupTranslated_Language");

                entity.HasOne(d => d.RoleGroup)
                    .WithMany(p => p.RoleGroupTranslated)
                    .HasForeignKey(d => d.RoleGroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RoleGroupTranslated_RoleGroup");
            });

            modelBuilder.Entity<Sector>(entity =>
            {
                entity.Property(e => e.Active)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.Createdon)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.SectorCode)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Sector)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Sector_Users");

                entity.HasOne(d => d.CreatedLanguage)
                    .WithMany(p => p.Sector)
                    .HasForeignKey(d => d.CreatedLanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("SectorCreated_Language");
            });

            modelBuilder.Entity<SectorTranslated>(entity =>
            {
                entity.HasKey(e => e.SectorTid);

                entity.Property(e => e.SectorTid).HasColumnName("SectorTId");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions).HasMaxLength(250);

                entity.Property(e => e.SectorName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.SectorTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("SectorTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.SectorTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("SectorTranslated_Language");
            });

            modelBuilder.Entity<Segment>(entity =>
            {
                entity.Property(e => e.Active)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.Createdon)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.SegmentCode)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Segment)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Segment_Users");

                entity.HasOne(d => d.Sector)
                    .WithMany(p => p.Segment)
                    .HasForeignKey(d => d.SectorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Segment_Sector");
            });

            modelBuilder.Entity<SegmentTranslated>(entity =>
            {
                entity.HasKey(e => e.SegmentTid);

                entity.Property(e => e.SegmentTid).HasColumnName("SegmentTId");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descriptions).HasMaxLength(250);

                entity.Property(e => e.SegmentName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.SegmentTranslated)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("SegmentTranslated_Users");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.SegmentTranslated)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("SegmentTranslated_Language");
            });

            modelBuilder.Entity<UserClientSiteRelation>(entity =>
            {
                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.ClientSite)
                    .WithMany(p => p.UserClientSiteRelation)
                    .HasForeignKey(d => d.ClientSiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("UserClientRelation_Client");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UserClientSiteRelationCreatedByNavigation)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("UserClientRelation_CreatedBy");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserClientSiteRelationUser)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("UserClientRelation_Users");
            });

            modelBuilder.Entity<UserRoleGroupRelation>(entity =>
            {
                entity.HasKey(e => e.UserRoleGroupRelId);

                entity.Property(e => e.Active)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("date")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UserRoleGroupRelationCreatedByNavigation)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserRoleGroupRelCreatedBy");

                entity.HasOne(d => d.RoleGroup)
                    .WithMany(p => p.UserRoleGroupRelation)
                    .HasForeignKey(d => d.RoleGroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserRoleGroupRelId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserRoleGroupRelationUser)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserRoleGroupRelUserId");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.EmailId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.MiddleName).HasMaxLength(50);

                entity.Property(e => e.Mobile).HasMaxLength(30);

                entity.Property(e => e.Phone).HasMaxLength(30);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.UserTypeNavigation)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.UserType)
                    .HasConstraintName("User_Lookup");
            });
        }
    }
}
