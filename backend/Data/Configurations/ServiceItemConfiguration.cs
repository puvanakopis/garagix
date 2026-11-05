using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Garagix.Api.Entities;

namespace Garagix.Api.Data.Configurations;

/// <summary>
/// Entity Framework Core mapping configuration and seed definitions for <see cref="ServiceItem"/>.
/// </summary>
public class ServiceItemConfiguration : IEntityTypeConfiguration<ServiceItem>
{
    private static readonly JsonSerializerOptions JsonOptions = new();

    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<ServiceItem> builder)
    {
        builder.ToTable("services");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasMaxLength(50);

        builder.Property(s => s.Name).IsRequired().HasMaxLength(150);
        builder.Property(s => s.Slug).IsRequired().HasMaxLength(150);
        builder.HasIndex(s => s.Slug).IsUnique();

        builder.Property(s => s.Category).IsRequired().HasMaxLength(50);
        builder.HasIndex(s => s.Category);

        builder.Property(s => s.ShortDescription).IsRequired().HasMaxLength(500);
        builder.Property(s => s.FullDescription).IsRequired().HasColumnType("longtext");

        builder.Property(s => s.StartingPriceLkr).HasColumnType("decimal(12,2)").HasDefaultValue(0);
        builder.Property(s => s.DurationMinutes).HasDefaultValue(0);

        builder.Property(s => s.Featured).HasDefaultValue(false);
        builder.Property(s => s.IsActive).HasDefaultValue(true);
        builder.HasIndex(s => s.IsActive);

        // Value conversions for JSON collections
        builder.Property(s => s.IncludedItems)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOptions),
                v => string.IsNullOrWhiteSpace(v) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>()
            )
            .HasColumnType("longtext");

        builder.Property(s => s.CommonSymptoms)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOptions),
                v => string.IsNullOrWhiteSpace(v) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>()
            )
            .HasColumnType("longtext");

        builder.Property(s => s.RecommendedMechanicIds)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOptions),
                v => string.IsNullOrWhiteSpace(v) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>()
            )
            .HasColumnType("longtext");

        builder.Property(s => s.CreatedAt).IsRequired();
        builder.Property(s => s.UpdatedAt);

        // Seed initial services catalog
        builder.HasData(GetInitialServices());
    }

    /// <summary>
    /// Returns the default seed catalog of 9 comprehensive vehicle repair packages.
    /// </summary>
    public static List<ServiceItem> GetInitialServices()
    {
        var baseDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        return
        [
            new ServiceItem
            {
                Id = "srv-1",
                Name = "General Car Maintenance",
                Slug = "general-car-maintenance",
                Category = "Maintenance",
                ShortDescription = "Complete 40-point preventive maintenance inspection and fluid top-up service.",
                FullDescription = "Our comprehensive General Car Maintenance package keeps your car running at peak performance. It encompasses multi-point mechanical inspections, engine fluid condition assessments, belt checks, filter cleaning, and tire pressure adjustments designed for tropical Sri Lankan driving conditions.",
                StartingPriceLkr = 18500m,
                DurationMinutes = 120,
                Featured = true,
                IsActive = true,
                IncludedItems =
                [
                    "40-Point safety & mechanical inspection",
                    "Top-up of steering, brake, and washer fluids",
                    "Air and cabin filter inspection/cleaning",
                    "Spark plug & ignition system inspection",
                    "Battery load and terminal check",
                    "Underbody & suspension inspection"
                ],
                CommonSymptoms =
                [
                    "Approaching scheduled service interval (5,000 / 10,000 km)",
                    "Sluggish acceleration or decreased fuel efficiency",
                    "Subtle rattling sounds over uneven road surfaces",
                    "Planning long-distance travel across provinces"
                ],
                RecommendedMechanicIds = ["mech-1", "mech-2"],
                CreatedAt = baseDate
            },
            new ServiceItem
            {
                Id = "srv-2",
                Name = "Engine Repair & Overhaul",
                Slug = "engine-repair-and-overhaul",
                Category = "Engine & Transmission",
                ShortDescription = "Advanced engine diagnostics, cylinder head servicing, and timing component repairs.",
                FullDescription = "From mysterious engine knock and timing chain replacements to full cylinder rebuilds, our certified engine specialists employ computerized bore-scopes, compression testers, and factory repair procedures to restore factory horsepower and reliability.",
                StartingPriceLkr = 48000m,
                DurationMinutes = 360,
                Featured = true,
                IsActive = true,
                IncludedItems =
                [
                    "Computerized diagnostic scan and live sensor analysis",
                    "Cylinder compression and leak-down test",
                    "Timing belt / timing chain alignment check",
                    "Gasket, seal, and oil leak remediation",
                    "Fuel injector cleaning & calibration",
                    "Post-repair dynamometer road testing"
                ],
                CommonSymptoms =
                [
                    "Check Engine light illuminated or flashing",
                    "Excessive white, blue, or black exhaust smoke",
                    "Metallic knocking or ticking engine noise",
                    "Loss of power during highway acceleration or uphill climbs",
                    "Engine overheating or frequent coolant loss"
                ],
                RecommendedMechanicIds = ["mech-1"],
                CreatedAt = baseDate
            },
            new ServiceItem
            {
                Id = "srv-3",
                Name = "Brake Repair & System Tuning",
                Slug = "brake-repair-and-tuning",
                Category = "Brakes & Tires",
                ShortDescription = "High-performance ceramic brake pad replacement, disc rotor skimming, and ABS bleed.",
                FullDescription = "Your safety is non-negotiable. Our technicians inspect and service hydraulic lines, calibrate ABS actuators, skim or replace warped disc rotors, and install dust-free ceramic brake pads for decisive stopping distance.",
                StartingPriceLkr = 14500m,
                DurationMinutes = 90,
                Featured = true,
                IsActive = true,
                IncludedItems =
                [
                    "Front & rear brake pad thickness measurement",
                    "Brake caliper slide pin lubrication",
                    "Disc rotor micrometer runout check & skimming",
                    "DOT 4 / DOT 5.1 high-temp fluid bleed",
                    "Emergency handbrake cable adjustment"
                ],
                CommonSymptoms =
                [
                    "High-pitched squealing or grinding when braking",
                    "Brake pedal feels soft or sinks to the floor",
                    "Vibration felt through steering wheel while stopping",
                    "Vehicle pulls noticeably to one side under braking"
                ],
                RecommendedMechanicIds = ["mech-3"],
                CreatedAt = baseDate
            },
            new ServiceItem
            {
                Id = "srv-4",
                Name = "Premium Oil Change & Lube Service",
                Slug = "premium-oil-change-lube",
                Category = "Maintenance",
                ShortDescription = "Full synthetic oil replacement with OEM filter and chassis lubrication.",
                FullDescription = "Keep your engine lubricated and protected from high thermal breakdown. Includes draining old oil, installing genuine OEM oil filter, pouring premium full-synthetic API-SP motor oil, and lubricating door hinges and chassis linkages.",
                StartingPriceLkr = 12500m,
                DurationMinutes = 45,
                Featured = false,
                IsActive = true,
                IncludedItems =
                [
                    "Up to 4 liters of premium full synthetic 0W-20 / 5W-30 engine oil",
                    "Genuine OEM oil filter & new drain plug crush washer",
                    "Reset of vehicle oil maintenance reminder",
                    "Complementary under-hood dust wash & fluid check"
                ],
                CommonSymptoms =
                [
                    "Engine oil change indicator light on dashboard",
                    "Dark, grimy oil on dipstick inspection",
                    "Engine runs louder with increased valve chatter"
                ],
                RecommendedMechanicIds = ["mech-2"],
                CreatedAt = baseDate
            },
            new ServiceItem
            {
                Id = "srv-5",
                Name = "Auto AC Repair & Climate Control",
                Slug = "auto-ac-repair-climate-control",
                Category = "AC & Climate",
                ShortDescription = "Evaporator leak detection, compressor testing, R134a/R1234yf gas recharge.",
                FullDescription = "In our tropical climate, an ice-cold air conditioning system is an essential comfort. We vacuum-test for refrigerant leaks, flush clogged condenser lines, replace antibacterial cabin filters, and service compressors.",
                StartingPriceLkr = 16500m,
                DurationMinutes = 120,
                Featured = true,
                IsActive = true,
                IncludedItems =
                [
                    "Electronic halogen refrigerant leak detection",
                    "AC system vacuum pressure test",
                    "Compressor clutch & coil electrical check",
                    "R134a / R1234yf precision gas recharge with PAG oil",
                    "Cabin antimicrobial ozone decontamination"
                ],
                CommonSymptoms =
                [
                    "AC blowing warm or ambient air only",
                    "Unpleasant moldy odor through AC vents",
                    "Hissing noise when AC button is pressed",
                    "Water pooling on front passenger floorboard"
                ],
                RecommendedMechanicIds = ["mech-6"],
                CreatedAt = baseDate
            },
            new ServiceItem
            {
                Id = "srv-6",
                Name = "Tire Replacement & Wheel Balancing",
                Slug = "tire-replacement-and-wheel-balancing",
                Category = "Brakes & Tires",
                ShortDescription = "Laser wheel balancing, brand-new tire fitting, and road force optimization.",
                FullDescription = "Equip your vehicle with superior wet-grip tires from Michelin, Continental, or Bridgestone. Every installation includes high-precision dynamic wheel balancing and new rubber valve stems.",
                StartingPriceLkr = 22000m,
                DurationMinutes = 60,
                Featured = false,
                IsActive = true,
                IncludedItems =
                [
                    "Tire demounting and computerized bead mounting",
                    "Laser dynamic wheel balancing on Corghi machine",
                    "Replacement of tire air valve cores",
                    "Nitrogen tire inflation for stable tire pressure",
                    "Tire tread depth and irregular wear inspection"
                ],
                CommonSymptoms =
                [
                    "Steering vibration at 70 - 100 km/h highway speeds",
                    "Tread depth worn below legal limit (1.6mm)",
                    "Cracking, sidewall bulging, or puncture damage"
                ],
                RecommendedMechanicIds = ["mech-4"],
                CreatedAt = baseDate
            },
            new ServiceItem
            {
                Id = "srv-7",
                Name = "Battery & Hybrid System Check",
                Slug = "battery-and-hybrid-system-check",
                Category = "Electrical & Battery",
                ShortDescription = "High-voltage hybrid battery cell balancing, inverter cooling, 12V test.",
                FullDescription = "Specialized diagnostic service for Toyota Prius, Axio, Honda Vezel, and modern EV/Hybrid platforms. We conduct cell internal resistance logging, hybrid cooling fan cleaning, and auxiliary 12V AGM battery health testing.",
                StartingPriceLkr = 19500m,
                DurationMinutes = 90,
                Featured = true,
                IsActive = true,
                IncludedItems =
                [
                    "Hybrid battery cell voltage differential scan",
                    "High voltage inverter coolant inspection",
                    "Hybrid blower motor & cooling duct decontamination",
                    "12V battery Cold Cranking Amps (CCA) load test",
                    "Alternator/DC-DC converter charging voltage test"
                ],
                CommonSymptoms =
                [
                    "Check Hybrid System warning on instrument cluster",
                    "Hybrid battery indicator drops rapidly and charges quickly",
                    "Engine running continuously without switching to EV mode",
                    "Car fails to start after parked overnight"
                ],
                RecommendedMechanicIds = ["mech-5"],
                CreatedAt = baseDate
            },
            new ServiceItem
            {
                Id = "srv-8",
                Name = "3D Wheel Alignment & Suspension Tuning",
                Slug = "3d-wheel-alignment-suspension",
                Category = "Brakes & Tires",
                ShortDescription = "Computerized 3D camera wheel alignment and shock absorber diagnostic.",
                FullDescription = "Eliminate uneven tire wear and steering drift with our Corghi 3D camera alignment rack. We accurately calibrate camber, caster, and toe angles to exact manufacturer tolerances.",
                StartingPriceLkr = 9500m,
                DurationMinutes = 60,
                Featured = false,
                IsActive = true,
                IncludedItems =
                [
                    "4-Wheel 3D camera sensor calibration",
                    "Toe-in / toe-out steering angle adjustment",
                    "Camber & caster angles alignment",
                    "Steering rack centering and tie-rod check",
                    "Before and after printed angle telemetry report"
                ],
                CommonSymptoms =
                [
                    "Steering wheel off-center when driving straight",
                    "Uneven inner or outer tire edge wear",
                    "Car wandering or pulling left/right on flat expressway"
                ],
                RecommendedMechanicIds = ["mech-4"],
                CreatedAt = baseDate
            },
            new ServiceItem
            {
                Id = "srv-9",
                Name = "Comprehensive Pre-Purchase Inspection",
                Slug = "comprehensive-pre-purchase-inspection",
                Category = "Diagnostics",
                ShortDescription = "120-point independent mechanical, chassis, paint gauge, and computer scan.",
                FullDescription = "Buying a used car? Protect your investment. Our master technicians inspect for accidental structural damage, flood immersion, odometer tampering, engine compression, and paint thickness consistency.",
                StartingPriceLkr = 25000m,
                DurationMinutes = 150,
                Featured = true,
                IsActive = true,
                IncludedItems =
                [
                    "120-Point bumper-to-bumper vehicle inspection",
                    "Digital coating thickness gauge check for repaint/filler",
                    "Full vehicle ECU scan for stored and pending error codes",
                    "Undercarriage chassis frame inspection for accident welds",
                    "Extensive road test under varying engine load and braking",
                    "Formal 10-page printed condition audit with photo proof"
                ],
                CommonSymptoms =
                [
                    "Prospective buyer evaluating a private or dealership vehicle",
                    "Vehicle warranty expiration check",
                    "Selling your car and wishing to provide verified condition proof"
                ],
                RecommendedMechanicIds = ["mech-1", "mech-2"],
                CreatedAt = baseDate
            }
        ];
    }
}

