﻿// <auto-generated />
using System;
using Backend.DbContextBD;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20230726101901_test8")]
    partial class test8
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Backend.Models.Access", b =>
                {
                    b.Property<int>("AccessId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("AccessId"));

                    b.Property<string>("AccessName")
                        .HasColumnType("text");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("LastModificatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("AccessId");

                    b.ToTable("Accesss");
                });

            modelBuilder.Entity("Backend.Models.Contact", b =>
                {
                    b.Property<int>("ContactId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ContactId"));

                    b.Property<string>("CompanyName")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("CreatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("LastModificatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Object")
                        .HasColumnType("text");

                    b.Property<string>("Text")
                        .HasColumnType("text");

                    b.HasKey("ContactId");

                    b.ToTable("Contacts");
                });

            modelBuilder.Entity("Backend.Models.LoginHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("LoginTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("LoginHistory");
                });

            modelBuilder.Entity("Backend.Models.Module", b =>
                {
                    b.Property<int>("ModuleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ModuleId"));

                    b.Property<int?>("AccessId")
                        .HasColumnType("integer");

                    b.Property<string>("CodMod")
                        .HasColumnType("text");

                    b.Property<string>("CodModPack")
                        .HasColumnType("text");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime>("LastModificatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("ModuleName")
                        .HasColumnType("text");

                    b.Property<string>("ModulePackage")
                        .HasColumnType("text");

                    b.Property<bool>("ModuleStatus")
                        .HasColumnType("boolean");

                    b.Property<int?>("ProductId")
                        .HasColumnType("integer");

                    b.HasKey("ModuleId");

                    b.HasIndex("AccessId");

                    b.HasIndex("ProductId");

                    b.ToTable("Modules");
                });

            modelBuilder.Entity("Backend.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ProductId"));

                    b.Property<string>("CodProd")
                        .HasColumnType("text");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("FileName")
                        .HasColumnType("text");

                    b.Property<DateTime>("LastModificatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("LogoFilePath")
                        .HasColumnType("text");

                    b.Property<string>("ProductName")
                        .HasColumnType("text");

                    b.Property<bool>("ProductStatus")
                        .HasColumnType("boolean");

                    b.Property<string>("ProductVersion")
                        .HasColumnType("text");

                    b.Property<DateTime>("PublishDate")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("ProductId");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("Backend.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UserId"));

                    b.Property<string>("ConfirmPassword")
                        .HasColumnType("text");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("FiscalCode")
                        .HasColumnType("integer");

                    b.Property<DateTime>("LastModificatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Level")
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .HasColumnType("text");

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("bytea");

                    b.Property<string>("PasswordResetToken")
                        .HasColumnType("text");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("bytea");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("text");

                    b.Property<DateTime?>("ResetTokenExpires")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("SubscribtionDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Token")
                        .HasColumnType("text");

                    b.Property<DateTime>("TokenCreated")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("TokenExpires")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UserStatus")
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .HasColumnType("text");

                    b.Property<DateTime?>("VerifiedAt")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("License", b =>
                {
                    b.Property<int>("LicenseId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("LicenseId"));

                    b.Property<int>("AccessId")
                        .HasColumnType("integer");

                    b.Property<int>("ActivationMonths")
                        .HasColumnType("integer");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("CreatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTimeOffset>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTimeOffset>("LastModificatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("LicenseHistoryId")
                        .HasColumnType("integer");

                    b.Property<string>("LicenseKey")
                        .HasColumnType("text");

                    b.Property<bool>("LicenseStatus")
                        .HasColumnType("boolean");

                    b.Property<string>("RenewMode")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("LicenseId");

                    b.HasIndex("AccessId");

                    b.HasIndex("LicenseHistoryId");

                    b.HasIndex("UserId");

                    b.ToTable("Licenses");
                });

            modelBuilder.Entity("LicenseHistory", b =>
                {
                    b.Property<int>("LicenseHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("LicenseHistoryId"));

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("LastModificatedDate")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("LicenseHistoryId");

                    b.ToTable("LicensesHistory");
                });

            modelBuilder.Entity("Backend.Models.LoginHistory", b =>
                {
                    b.HasOne("Backend.Models.User", null)
                        .WithMany("LoginHistory")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.Module", b =>
                {
                    b.HasOne("Backend.Models.Access", "Access")
                        .WithMany("Modules")
                        .HasForeignKey("AccessId");

                    b.HasOne("Backend.Models.Product", "Product")
                        .WithMany("Modules")
                        .HasForeignKey("ProductId");

                    b.Navigation("Access");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("License", b =>
                {
                    b.HasOne("Backend.Models.Access", "Access")
                        .WithMany("Licenses")
                        .HasForeignKey("AccessId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LicenseHistory", null)
                        .WithMany("licenses")
                        .HasForeignKey("LicenseHistoryId");

                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("Licenses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Access");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.Access", b =>
                {
                    b.Navigation("Licenses");

                    b.Navigation("Modules");
                });

            modelBuilder.Entity("Backend.Models.Product", b =>
                {
                    b.Navigation("Modules");
                });

            modelBuilder.Entity("Backend.Models.User", b =>
                {
                    b.Navigation("Licenses");

                    b.Navigation("LoginHistory");
                });

            modelBuilder.Entity("LicenseHistory", b =>
                {
                    b.Navigation("licenses");
                });
#pragma warning restore 612, 618
        }
    }
}
