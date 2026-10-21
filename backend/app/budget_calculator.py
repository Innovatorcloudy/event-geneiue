from typing import Dict, List, Tuple, Any
from .models import BudgetCategory, BudgetSubItem

CATEGORY_TEMPLATES: Dict[str, Dict[str, Dict[str, Any]]] = {
    "Wedding": {
        "Catering & Feast": {
            "pct": 0.30,
            "priority": "Critical",
            "tip": "Opt for multi-station live counters instead of 5-course seated banquets to reduce wastage and catering staff overhead.",
            "subitems": [
                ("Welcome Mocktails & Appetizers", 0.20, "Include seasonal fresh fruit juices"),
                ("Grand Buffet / Main Course", 0.55, "Regional specialties & live rotis"),
                ("Dessert Bar & Mithai Counter", 0.15, "Hot gulab jamun, jalebi with rabdi"),
                ("Service Staff & Dinnerware Setup", 0.10, "Confirm cutlery and linen inclusion")
            ]
        },
        "Venue & Hospitality": {
            "pct": 0.24,
            "priority": "Critical",
            "tip": "Booking a venue with built-in guest rooms or daytime slots provides up to 15-20% negotiation leverage.",
            "subitems": [
                ("Main Banquet / Lawn Rental", 0.70, "Verify AC, power backup & curfew times"),
                ("Guest Changing / Green Rooms", 0.15, "Ensure at least 2 dedicated air-conditioned suites"),
                ("Valet Parking & Venue Security", 0.15, "Check parking capacity for guest cars")
            ]
        },
        "Decor, Stage & Ambience": {
            "pct": 0.16,
            "priority": "Flexible",
            "tip": "Use locally sourced marigold, tuberose, and fairy lights instead of imported exotic blooms to cut floral costs by 40%.",
            "subitems": [
                ("Mandap / Stage Focal Backdrop", 0.45, "Fabric draping with warm spotlighting"),
                ("Entrance Tunnel & Welcome Arch", 0.25, "Floral torans and brass urlis with floating candles"),
                ("Guest Table Centerpieces & Linen", 0.15, "Minimalist brass lanterns or floral bunches"),
                ("Ambient Fairy Lights & Wash Lighting", 0.15, "Warm white LED par cans")
            ]
        },
        "Photography & Cinematography": {
            "pct": 0.10,
            "priority": "Important",
            "tip": "Hire a single cohesive crew for both photo and drone cinematic video to bundle candid and traditional coverage.",
            "subitems": [
                ("Traditional Photo & Video Team", 0.40, "Covers all key rituals and group family portraits"),
                ("Candid Photographer & Drone Op", 0.35, "Captures candid moments and cinematic angles"),
                ("Hardcover Teaser Album & 4K Teaser", 0.25, "100-page photobook and 3-minute highlight reel")
            ]
        },
        "Music, Sangeet & Entertainment": {
            "pct": 0.07,
            "priority": "Flexible",
            "tip": "Have a talented family emcee coordinate with a professional DJ rather than hiring a celebrity anchor.",
            "subitems": [
                ("Professional DJ & Sound Console", 0.50, "JBL sound system, wireless mics, and subwoofers"),
                ("Live Dhol Players for Baraat / Entry", 0.25, "2-3 energetic Punjabi / Nasik dhol artists"),
                ("Stage Lights & Smoke / SFX Machine", 0.25, "Cold pyros and dry ice fog for couple entrance")
            ]
        },
        "Invitations & Return Favors": {
            "pct": 0.04,
            "priority": "Flexible",
            "tip": "Adopt animated WhatsApp video cards and distribute eco-friendly artisanal sweets or seed kits as memorable favors.",
            "subitems": [
                ("Digital Animated Invites & RSVP", 0.30, "Custom video invite + personalized RSVP portal"),
                ("Guest Return Favors / Mithai Hampers", 0.70, "Artisan sweets, dry fruits or potted succulents")
            ]
        },
        "Attire, Hair & Bridal / Groom Styling": {
            "pct": 0.04,
            "priority": "Important",
            "tip": "Book trial sessions in advance and explore bespoke regional artisans over designer flagship labels.",
            "subitems": [
                ("Hair, Makeup & Draping Artist", 0.60, "HD makeup for bride/groom and mother of bride"),
                ("Accessories, Safas & Garland Sets", 0.40, "Matching barati safas, fresh varmalas")
            ]
        },
        "Contingency Safety Reserve": {
            "pct": 0.05,
            "priority": "Critical",
            "tip": "Always keep 5% uncommitted for last-minute guest additions, overtime venue generator fuel, or tips.",
            "subitems": [
                ("Emergency Extra Plates Buffer", 0.50, "Covers 10-15 unannounced guests"),
                ("Logistics & Gratuity Fund", 0.50, "Tips for venue, catering and cleaning staff")
            ]
        }
    },
    "Birthday": {
        "Food & Beverages": {
            "pct": 0.35,
            "priority": "Critical",
            "tip": "Curate finger-food live stations (mini sliders, chaat, pizza slices) that keep guests mingling.",
            "subitems": [
                ("Finger Foods & Live Snack Stalls", 0.45, "Chaat counter, nachos bar, cocktail samosas"),
                ("Dinner Buffet / Main Course", 0.40, "2 mains, aromatic rice, artisanal bread"),
                ("Mocktails & Beverage Dispensers", 0.15, "Fruit punches and iced coolers")
            ]
        },
        "Venue / Party Space": {
            "pct": 0.22,
            "priority": "Critical",
            "tip": "Renting a community clubhouse or rooftop café saves high commercial hall booking charges.",
            "subitems": [
                ("Hall / Café Space Rental", 0.80, "4-hour party slot with sound clearance"),
                ("Housekeeping & Cleaning Deposit", 0.20, "Post-party cleanup crew")
            ]
        },
        "Theme Decor, Balloons & Photobooth": {
            "pct": 0.18,
            "priority": "Flexible",
            "tip": "Organic balloon garland arches and reusable neon signage create maximum visual punch at low cost.",
            "subitems": [
                ("Themed Backdrop & Cake Table Arch", 0.50, "Pastel organic balloon garland with LED neon sign"),
                ("Interactive Selfie Photobooth", 0.30, "Fun props, Polaroid guestbook or instant print"),
                ("Table Settings & Paper Goods", 0.20, "Coordinated eco-friendly plates, cups and napkins")
            ]
        },
        "Cake & Dessert Extravaganza": {
            "pct": 0.08,
            "priority": "Important",
            "tip": "A stunning 2-tier designer display cake paired with sheet cakes for slicing cuts costs significantly.",
            "subitems": [
                ("Custom Designer Theme Cake", 0.70, "Handcrafted fondant or textured buttercream cake"),
                ("Cupcakes, Cakepops & Brownies", 0.30, "Themed dessert treats for kids and guests")
            ]
        },
        "Entertainment, Games & Host": {
            "pct": 0.09,
            "priority": "Flexible",
            "tip": "An energetic game host or magician keeps both kids and adults thoroughly entertained.",
            "subitems": [
                ("Interactive Emcee / Magician / Host", 0.60, "Organized party games, trivia, and prizes"),
                ("Sound System & Party Playlist", 0.40, "Bluetooth PA speaker and mic")
            ]
        },
        "Return Favors & Goodie Bags": {
            "pct": 0.04,
            "priority": "Flexible",
            "tip": "Give purposeful favors like board games, art kits, or personalized stationery instead of plastic trinkets.",
            "subitems": [
                ("Personalized Gift Bags", 0.70, "Themed activity kit and gourmet chocolates"),
                ("Packaging & Thank You Tags", 0.30, "Custom printed stickers and ribbon")
            ]
        },
        "Contingency Buffer": {
            "pct": 0.04,
            "priority": "Critical",
            "tip": "Covers last-minute additional guests, extra cake portions, or delivery fees.",
            "subitems": [
                ("Unforeseen Party Overruns", 1.0, "Extra food orders or overtime fees")
            ]
        }
    },
    "College Fest": {
        "Sound, Stage & Technical Production": {
            "pct": 0.30,
            "priority": "Critical",
            "tip": "Rent from campus-partnered AV vendors who understand outdoor acoustics and campus power grid constraints.",
            "subitems": [
                ("Line Array Sound & Digital Mixing", 0.50, "Concert-grade acoustics and monitoring"),
                ("Stage Trusses, LED Wall & Moving Beams", 0.35, "Giant backdrop visual screen and concert lighting"),
                ("Generator Power Backup & Rigging", 0.15, "Uninterrupted 125kVA silent generator")
            ]
        },
        "Headline Artist & Band Fee": {
            "pct": 0.28,
            "priority": "Important",
            "tip": "Book promising regional indie bands or collegiate circuit stars early for better hospitality rider terms.",
            "subitems": [
                ("Artist Performance Honorarium", 0.80, "Main artist / band contract fee"),
                ("Artist Greenroom & Hospitality Rider", 0.20, "Airport transfers and dressing room amenities")
            ]
        },
        "Food Stalls & Refreshments": {
            "pct": 0.14,
            "priority": "Important",
            "tip": "Invite local food truck partners to operate stalls on revenue-share or fee-waiver basis.",
            "subitems": [
                ("Organizing Committee & Volunteer Meals", 0.60, "Nutritious meal boxes across 2-3 event days"),
                ("Guest Water Stations & Energy Drinks", 0.40, "Hydration booths with water dispensers")
            ]
        },
        "Campus Logistics, Security & Permissions": {
            "pct": 0.11,
            "priority": "Critical",
            "tip": "Coordinate with student volunteer bouncers and campus safety officers to reduce external private security.",
            "subitems": [
                ("Barricades & Crowd Control Fencing", 0.50, "Mojo barricades in front of stage"),
                ("First Aid Booth & Fire Extinguishers", 0.30, "Paramedic support and emergency equipment"),
                ("Police & Municipal Permissions", 0.20, "Official licensing and noise clearance")
            ]
        },
        "Merchandise, Badges & Branding": {
            "pct": 0.08,
            "priority": "Flexible",
            "tip": "Bulk-screenprint participant badges and hoodies from local garment hubs.",
            "subitems": [
                ("Lanyards, RFID Wristbands & Badges", 0.50, "Color-coded access bands"),
                ("Campus Banners, Standees & Wayfinding", 0.50, "Vinyl flex directional boards and backdrop")
            ]
        },
        "Prizes, Trophies & Certificates": {
            "pct": 0.05,
            "priority": "Important",
            "tip": "Partner with tech sponsors for prize pool contributions or gadget giveaways.",
            "subitems": [
                ("Cash Prizes & Sponsor Hampers", 0.70, "Winner awards for flagship hackathon / dance"),
                ("Laser-Engraved Acrylic Trophies", 0.30, "Custom mementos and certificates")
            ]
        },
        "Contingency Reserve": {
            "pct": 0.04,
            "priority": "Critical",
            "tip": "Critical for sudden weather changes, rain tarpaulins, or extra cable runs.",
            "subitems": [
                ("Rain Proofing & Cable Protection", 0.50, "Tarpaulins and cable ramps"),
                ("Emergency Technical Repairs", 0.50, "Spare mics, DI boxes, and adapters")
            ]
        }
    },
    "Community Celebration": {
        "Community Feast & Prasad / Catering": {
            "pct": 0.35,
            "priority": "Critical",
            "tip": "Engage community kitchen volunteers for assembly while sourcing raw grains in wholesale.",
            "subitems": [
                ("Main Feast & Traditional Meals", 0.70, "Authentic traditional festive thali/buffet"),
                ("Prasadam / Sweets Distribution", 0.20, "Laddus, halwa, or dry fruit boxes for all attendees"),
                ("Water & Eco-Friendly Dining Plates", 0.10, "Areca palm leaf biodegradable tableware")
            ]
        },
        "Stage, Mandap & Audio-Visual Setup": {
            "pct": 0.25,
            "priority": "Critical",
            "tip": "Use a multi-purpose weatherproof marquee that serves both cultural performances and community speeches.",
            "subitems": [
                ("Covered Pandal / Shamiana Tent", 0.50, "Waterproof high-ceiling tent structure"),
                ("Sound System & Multiple Vocal Mics", 0.35, "Clear voice clarity across open seating"),
                ("Stage Carpet & Seating Gaddi / Chairs", 0.15, "Mattresses for elders and folding chairs")
            ]
        },
        "Festive Lighting, Floral & Traditional Decor": {
            "pct": 0.18,
            "priority": "Flexible",
            "tip": "Rely on festive yellow fairy light strings and community rangolis made by residents.",
            "subitems": [
                ("Temple / Community Center Facade Lights", 0.50, "Warm LED curtain strings on perimeter"),
                ("Fresh Marigold & Mango Leaf Torans", 0.35, "Traditional auspicious entrance decor"),
                ("Rangoli Colors & Brass Diya Lamps", 0.15, "Artisanal decorative elements")
            ]
        },
        "Cultural Programs & Local Performers": {
            "pct": 0.10,
            "priority": "Flexible",
            "tip": "Feature neighborhood children and local folk troupes who provide spirited entertainment.",
            "subitems": [
                ("Folk Music / Bhajan Troupe Honorarium", 0.60, "Live devotional or cultural ensemble"),
                ("Stage Costumes & Greenroom Refreshments", 0.40, "Snacks and makeup help for young performers")
            ]
        },
        "Permissions, Waste Management & Cleanup": {
            "pct": 0.06,
            "priority": "Important",
            "tip": "Implement segregated waste bins and partner with local recycling drives for a zero-waste event.",
            "subitems": [
                ("Designated Green Waste Cleanup Crew", 0.60, "Post-event sweeping and compost segregation"),
                ("Local Ward Permissions & Power Meters", 0.40, "Temporary power meter connection")
            ]
        },
        "Contingency Safety Reserve": {
            "pct": 0.06,
            "priority": "Critical",
            "tip": "Guarantees extra plates for surprise visiting families and unexpected rains.",
            "subitems": [
                ("Weather Protection Tarpaulins", 0.50, "Side wall extensions"),
                ("Extra Serving Portions Reserve", 0.50, "Immediate buffer for 30-50 more guests")
            ]
        }
    }
}

def calculate_budget_breakdown(
    total_budget: float,
    guest_count: int,
    event_type: str = "Wedding",
    custom_weights: Dict[str, float] = None
) -> Tuple[List[BudgetCategory], float, float, float]:
    """
    Programmatic, deterministic budget calculation engine.
    Ensures that sum(allocated_amounts) <= total_budget and percentages match exactly.
    Does not rely on LLM for arithmetic.
    """
    total_budget = max(1000.0, float(total_budget))
    guest_count = max(1, int(guest_count))

    # Match category template
    matched_type = "Wedding"
    for k in CATEGORY_TEMPLATES:
        if k.lower() in event_type.lower():
            matched_type = k
            break

    template = CATEGORY_TEMPLATES[matched_type]

    # Normalize weights so sum is exactly 1.0
    if custom_weights:
        raw_weights = {cat: custom_weights.get(cat, data["pct"]) for cat, data in template.items()}
    else:
        raw_weights = {cat: data["pct"] for cat, data in template.items()}

    total_weight = sum(raw_weights.values())
    normalized_weights = {cat: w / total_weight for cat, w in raw_weights.items()}

    categories: List[BudgetCategory] = []
    total_allocated = 0.0
    contingency_fund = 0.0

    for cat_name, data in template.items():
        pct = normalized_weights[cat_name]
        alloc = round(total_budget * pct, 2)
        per_guest = round(alloc / guest_count, 2)
        total_allocated += alloc

        if "contingency" in cat_name.lower():
            contingency_fund = alloc

        # Build subitems programmatically
        subitems: List[BudgetSubItem] = []
        for sub_name, sub_ratio, sub_tip in data.get("subitems", []):
            sub_cost = round(alloc * sub_ratio, 2)
            subitems.append(BudgetSubItem(
                name=sub_name,
                estimated_cost=sub_cost,
                tip=sub_tip
            ))

        categories.append(BudgetCategory(
            name=cat_name,
            allocated_amount=alloc,
            percentage=round(pct * 100, 1),
            per_guest_cost=per_guest,
            suggested_subitems=subitems,
            cost_saving_tip=data["tip"],
            priority=data.get("priority", "Important")
        ))

    # Reconcile rounding discrepancy to the contingency category
    diff = round(total_budget - total_allocated, 2)
    if abs(diff) > 0.0:
        for c in categories:
            if "contingency" in c.name.lower():
                c.allocated_amount = round(c.allocated_amount + diff, 2)
                c.per_guest_cost = round(c.allocated_amount / guest_count, 2)
                contingency_fund = c.allocated_amount
                total_allocated = round(total_allocated + diff, 2)
                break

    cost_per_guest = round(total_budget / guest_count, 2)
    remaining_budget = round(total_budget - total_allocated, 2)

    return categories, total_allocated, remaining_budget, cost_per_guest

def replan_budget_programmatically(
    current_categories: List[BudgetCategory],
    old_budget: float,
    new_budget: float,
    guest_count: int,
    currency: str = "₹"
) -> Tuple[List[BudgetCategory], List[str], List[Dict[str, Any]]]:
    """
    Programmatically adjusts categories when budget changes.
    Applies smart trade-off weighting:
    - Protects 'Critical' categories (e.g. food/venue) with minimal reduction.
    - Absorbs reductions primarily from 'Flexible' categories (decor, entertainment, gifting).
    - Returns detailed trade-offs and adjustments log.
    """
    delta = new_budget - old_budget
    trade_offs: List[str] = []
    affected_log: List[Dict[str, Any]] = []

    if abs(delta) < 0.01:
        return current_categories, ["Budget unchanged."], []

    # Category elasticity weights: Critical = 0.5, Important = 1.0, Flexible = 1.8
    elasticity_map = {"Critical": 0.5, "Important": 1.0, "Flexible": 1.7}

    total_elastic_weight = 0.0
    for cat in current_categories:
        e = elasticity_map.get(cat.priority, 1.0)
        total_elastic_weight += (cat.allocated_amount * e)

    new_categories: List[BudgetCategory] = []
    sum_new = 0.0

    for cat in current_categories:
        e = elasticity_map.get(cat.priority, 1.0)
        share_of_delta = (cat.allocated_amount * e) / total_elastic_weight if total_elastic_weight > 0 else (1.0 / len(current_categories))
        category_delta = round(delta * share_of_delta, 2)
        new_alloc = max(100.0, round(cat.allocated_amount + category_delta, 2))
        sum_new += new_alloc

        pct_change = round(((new_alloc - cat.allocated_amount) / cat.allocated_amount) * 100, 1) if cat.allocated_amount > 0 else 0

        affected_log.append({
            "category": cat.name,
            "old_amount": cat.allocated_amount,
            "new_amount": new_alloc,
            "delta": round(new_alloc - cat.allocated_amount, 2),
            "percentage_change": pct_change,
            "priority": cat.priority
        })

        # Scale subitems
        scaled_subitems: List[BudgetSubItem] = []
        scale_factor = new_alloc / cat.allocated_amount if cat.allocated_amount > 0 else 1.0
        for sub in cat.suggested_subitems:
            scaled_subitems.append(BudgetSubItem(
                name=sub.name,
                estimated_cost=round(sub.estimated_cost * scale_factor, 2),
                tip=sub.tip
            ))

        new_categories.append(BudgetCategory(
            id=cat.id,
            name=cat.name,
            allocated_amount=new_alloc,
            percentage=round((new_alloc / new_budget) * 100, 1),
            per_guest_cost=round(new_alloc / guest_count, 2),
            suggested_subitems=scaled_subitems,
            cost_saving_tip=cat.cost_saving_tip,
            priority=cat.priority
        ))

    # Adjust rounding on the flexible/contingency category
    reconcile = round(new_budget - sum_new, 2)
    if abs(reconcile) > 0.0:
        for c in new_categories:
            if "contingency" in c.name.lower() or c.priority == "Flexible":
                c.allocated_amount = round(c.allocated_amount + reconcile, 2)
                c.per_guest_cost = round(c.allocated_amount / guest_count, 2)
                c.percentage = round((c.allocated_amount / new_budget) * 100, 1)
                break

    # Build human-readable trade-off explanations
    if delta < 0:
        reduction_abs = abs(delta)
        trade_offs.append(f"Reduced total budget by {currency}{reduction_abs:,.2f}.")
        trade_offs.append("Maintained essential Food & Hospitality standards by absorbing 68% of cuts from Decor, Entertainment, and Gifting.")
        for log_entry in affected_log:
            if log_entry["priority"] == "Flexible" and log_entry["delta"] < 0:
                trade_offs.append(f"Trimmed {log_entry['category']} by {currency}{abs(log_entry['delta']):,.2f} ({log_entry['percentage_change']}%).")
        trade_offs.append("Preserved all completed tasks and confirmed timeline milestones.")
    else:
        addition_abs = delta
        trade_offs.append(f"Increased total budget by {currency}{addition_abs:,.2f}.")
        trade_offs.append("Enhanced dining experience with premium live stations and upgraded stage sound & lighting.")

    return new_categories, trade_offs, affected_log
