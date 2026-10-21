import os
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple

from .models import (
    EventRequest,
    EventPlan,
    BudgetCategory,
    TimelineTask,
    VendorItem,
    PersonalizedIdeas,
    ColorPaletteItem,
    CulturalActivity,
    PlanRevisionRequest,
    TradeOffAnalysis
)
from .budget_calculator import calculate_budget_breakdown, replan_budget_programmatically
from .config import GEMINI_API_KEY, GEMINI_MODEL_PRIMARY, GEMINI_MODEL_FALLBACK

import httpx

# Try importing google.genai optionally
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except Exception:
    GENAI_AVAILABLE = False


class EventPlannerEngine:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or GEMINI_API_KEY
        self.client = None
        if GENAI_AVAILABLE and self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Failed to initialize google.genai client: {e}")
                self.client = None

    def set_api_key(self, new_key: str):
        self.api_key = new_key.strip()
        if GENAI_AVAILABLE and self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Error resetting API key: {e}")
                self.client = None

    def _calculate_deadlines(self, event_date_str: str) -> Dict[str, Tuple[str, int]]:
        """Compute calendar dates for timeline milestones based on event date."""
        try:
            event_dt = datetime.strptime(event_date_str, "%Y-%m-%d")
        except Exception:
            event_dt = datetime.now() + timedelta(days=120)

        milestones = {
            "6 Months Out": (event_dt - timedelta(days=180), -180),
            "3 Months Out": (event_dt - timedelta(days=90), -90),
            "1 Month Out": (event_dt - timedelta(days=30), -30),
            "2 Weeks Out": (event_dt - timedelta(days=14), -14),
            "1 Week Out": (event_dt - timedelta(days=7), -7),
            "Day Before": (event_dt - timedelta(days=1), -1),
            "Event Day": (event_dt, 0),
            "Post-Event": (event_dt + timedelta(days=3), 3),
        }
        return {
            k: (dt.strftime("%d %b %Y"), offset)
            for k, (dt, offset) in milestones.items()
        }

    def generate_timeline(self, req: EventRequest) -> List[TimelineTask]:
        """Generate structured timeline tasks mapped to actual calendar deadlines."""
        deadlines = self._calculate_deadlines(req.event_date)
        tasks = []

        is_wedding = "wedding" in req.event_type.lower()
        is_birthday = "birthday" in req.event_type.lower()
        is_college = "college" in req.event_type.lower() or "fest" in req.event_type.lower()

        if is_wedding:
            raw_tasks = [
                ("Finalize Venue & Banquet Hall Contract", "Venue", "6 Months Out", "High"),
                ("Book Lead Caterer & Schedule Menu Tasting", "Catering", "6 Months Out", "High"),
                ("Confirm Photographer & Cinematographer Duo", "Media", "3 Months Out", "High"),
                ("Select Decor Theme & Finalize Stage Layout", "Decor", "3 Months Out", "Medium"),
                ("Send Digital 'Save the Date' Invites to Outstation Guests", "Invites", "3 Months Out", "Medium"),
                ("Lock In Sangeet DJ, Sound Equipment & Choreographer", "Entertainment", "1 Month Out", "High"),
                ("Confirm Bridal / Groom Attire & First Fittings", "Attire", "1 Month Out", "Medium"),
                ("Distribute Formal Invites & Collate Digital RSVPs", "Invites", "1 Month Out", "High"),
                ("Finalize Baraat Route, Permissions & Live Dhol Troupe", "Logistics", "2 Weeks Out", "Medium"),
                ("Dry-Run Menu Quantities with Catering Captain", "Catering", "2 Weeks Out", "High"),
                ("Arrange Guest Airport Transfers & Hotel Room Allotments", "Hospitality", "1 Week Out", "Medium"),
                ("Prepare Gratuity Envelopes & Contingency Cash Reserve", "Finance", "1 Week Out", "High"),
                ("Hall Handover, Sound Check & Stage Backdrop Setup", "Production", "Day Before", "High"),
                ("Mehendi Application & Haldi Ceremony Execution", "Rituals", "Day Before", "Medium"),
                ("Coordinate Varmala, Mandap Setup & Live Counters Opening", "Event Day", "Event Day", "High"),
                ("Guest Reception, Sangeet Performances & Banquet Dinner", "Event Day", "Event Day", "High"),
                ("Settle Vendor Final Dues & Collect High-Res Raw Footage", "Post-Event", "Post-Event", "Medium"),
            ]
        elif is_birthday:
            raw_tasks = [
                ("Select Theme & Reserve Party Hall / Café Lounge", "Venue", "1 Month Out", "High"),
                ("Book Custom Designer Cake & Dessert Artisan", "Bakery", "3 Months Out" if "milestone" in req.title.lower() else "1 Month Out", "High"),
                ("Design Animated Digital Invitation Card", "Invites", "1 Month Out", "Medium"),
                ("Order Theme Props, Organic Balloons & Neon Signs", "Decor", "2 Weeks Out", "Medium"),
                ("Hire Emcee, Magician or Kids Activity Host", "Entertainment", "2 Weeks Out", "Medium"),
                ("Finalize Finger-Food Platter & Mocktail Menu", "Catering", "1 Week Out", "High"),
                ("Pack Customized Goodie Bags & Return Favors", "Favors", "1 Week Out", "Medium"),
                ("Confirm Party Playlist & Test Bluetooth Speakers", "Audio", "Day Before", "Medium"),
                ("Assemble Balloon Arch & Table Decor Setup", "Decor", "Event Day", "High"),
                ("Host Games, Cake Cutting & Birthday Dinner", "Event Day", "Event Day", "High"),
                ("Send Photo Highlights to Guests via Shared Link", "Post-Event", "Post-Event", "Low"),
            ]
        elif is_college:
            raw_tasks = [
                ("Form Student Organizing Committees & Faculty Approvals", "Admin", "6 Months Out", "High"),
                ("Procure Campus Grounds & Municipal Loudspeaker Permits", "Legal", "3 Months Out", "High"),
                ("Book Headlining Musical Artist / Band & Rider Review", "Artist", "3 Months Out", "High"),
                ("Contract Line-Array Sound & Giant LED Wall Vendor", "AV", "1 Month Out", "High"),
                ("Launch Online Registrations, Ticketing & Sponsor Outreach", "Marketing", "1 Month Out", "High"),
                ("Assemble Mojo Barricades, Security & Paramedic Booths", "Safety", "2 Weeks Out", "High"),
                ("Print Participant Badges, Wristbands & Event Schedules", "Logistics", "1 Week Out", "Medium"),
                ("Stage Rigging, Sound Check & Lighting Run-Through", "Technical", "Day Before", "High"),
                ("Execute Competitions, Flagship Concert & Food Stalls", "Live", "Event Day", "High"),
                ("Campus Grounds Cleanup, Waste Audit & Trophy Distribution", "Wrap-up", "Post-Event", "Medium"),
            ]
        else:
            raw_tasks = [
                ("Reserve Community Hall or Open Grounds", "Venue", "3 Months Out", "High"),
                ("Confirm Traditional Feast Caterer & Raw Grain Orders", "Catering", "1 Month Out", "High"),
                ("Erect Weatherproof Shamiana Pandal & Stage Audio", "Production", "2 Weeks Out", "High"),
                ("Arrange Traditional Performers / Folk Troupe", "Cultural", "2 Weeks Out", "Medium"),
                ("Coordinate Resident Volunteer Rosters & Registration Desk", "Volunteers", "1 Week Out", "High"),
                ("Install Perimeter Fairy Lights & Auspicious Torans", "Decor", "Day Before", "Medium"),
                ("Community Gathering, Speeches, Cultural Show & Feast", "Live", "Event Day", "High"),
                ("Post-Event Green Cleanup & Return of Rented Furniture", "Logistics", "Post-Event", "Medium"),
            ]

        for title, cat, tf, prio in raw_tasks:
            deadline_str, offset = deadlines.get(tf, (req.event_date, 0))
            tasks.append(TimelineTask(
                title=title,
                category=cat,
                timeframe=tf,
                deadline_offset_days=offset,
                estimated_deadline=deadline_str,
                priority=prio,
                completed=False
            ))

        return tasks

    def generate_vendor_checklist(self, req: EventRequest) -> List[VendorItem]:
        """Vendor checklist with criteria and transparent warnings."""
        curr = req.currency
        return [
            VendorItem(
                category="Catering & Beverage Services",
                requirements=[
                    f"FSSAI food-safety certification and minimum {req.guest_count} pax capacity",
                    "Live multi-cuisine stations with separate vegetarian / Jain preparation zones",
                    "Uniformed service waitstaff (1 server per 25 guests minimum)",
                    "Provision of insulated chaffing dishes and eco-friendly tableware"
                ],
                questions_to_ask=[
                    "Is a complimentary menu tasting session included prior to contract signing?",
                    "What is your exact protocol for surplus unconsumed food?",
                    "Do you charge corkage or handling fees for outside beverages?",
                    "What is the billing policy if guest count fluctuates by +/- 10% on the day?"
                ],
                comparison_criteria=[
                    "Per-plate pricing vs taste quality and live presentation",
                    "Kitchen hygiene standards and live counter equipment quality",
                    "Staff grooming, punctuality track record, and contingency response"
                ],
                typical_cost_range=f"{curr}800 - {curr}2,200 per guest",
                cautionary_advice="Never pay 100% upfront. Retain 15-20% payable after successful post-event dinner handover."
            ),
            VendorItem(
                category="Decor, Floral & Stage Production",
                requirements=[
                    "3D layout or sketch of the main stage, mandap, and entrance tunnel",
                    "Flame-retardant fabric drape materials and wind-resistant outdoor rigging",
                    "Fresh regional marigold, roses, and orchids delivered morning of event"
                ],
                questions_to_ask=[
                    "Are generator fuel and installation ladder equipment included in the quote?",
                    "What happens if bad weather or wind damages outdoor elements?",
                    "What is the exact tear-down timeline required by the venue?"
                ],
                comparison_criteria=[
                    "Portfolio consistency across real weddings vs staged promotional shoots",
                    "Transparency in itemized floral counts vs lumped lump-sum costs",
                    "Readiness of standby repair crews during the live event"
                ],
                typical_cost_range=f"{curr}60,000 - {curr}2,50,000",
                cautionary_advice="Verify in writing that artificial synthetic flowers are not substituted for promised fresh floral arrangements."
            ),
            VendorItem(
                category="Photography & Cinematography Crew",
                requirements=[
                    "Dual-shooter team: 1 traditional portrait photographer + 1 candid artist",
                    "4K video capability with dual SD card backup slots on all cameras",
                    "Drone operator with local municipal safety and flight permissions"
                ],
                questions_to_ask=[
                    "Who specifically will be behind the camera on our event day?",
                    "What is the exact turnaround timeline for raw photos vs edited 4K highlight reels?",
                    "Do you provide raw uncompressed footage on an external SSD?"
                ],
                comparison_criteria=[
                    "Color grading and natural skin tones in indoor flash lighting",
                    "Ability to blend in unobtrusively without blinding guests with continuous lights",
                    "Customer reviews regarding delivery punctuality"
                ],
                typical_cost_range=f"{curr}40,000 - {curr}1,50,000",
                cautionary_advice="Insist on naming the actual photographers in the contract. Some agencies outsource bookings to untested freelance juniors."
            ),
            VendorItem(
                category="Sound, DJ & Live Entertainment",
                requirements=[
                    "Minimum 5kW professional JBL / RCF active speaker array",
                    "At least 4 wireless handheld UHF microphones with fresh batteries",
                    "Curfew-compliant sound level monitoring"
                ],
                questions_to_ask=[
                    "Do you carry an emergency backup mixer, spare laptop, and extra cables?",
                    "Will you accept a family 'Must-Play' and 'Do-Not-Play' song playlist?",
                    "Are stage cold pyros and smoke haze included in the sound package?"
                ],
                comparison_criteria=[
                    "Crowd engagement and ability to read room energy across age groups",
                    "Seamless audio transitions without awkward dead silences",
                    "Clarity of vocal announcements without audio feedback screeches"
                ],
                typical_cost_range=f"{curr}25,000 - {curr}80,000",
                cautionary_advice="Confirm local outdoor music curfew laws (typically 10:00 PM) to avoid sound confiscation or police fines."
            ),
            VendorItem(
                category="Hair, Makeup & Draping Artist",
                requirements=[
                    "On-location greenroom presence with professional ring light setup",
                    "High-definition, humidity-proof bridal/groom foundation products",
                    "Traditional sari / lehenga draping specialist"
                ],
                questions_to_ask=[
                    "Can we schedule a paid or complimentary look trial 3 weeks prior?",
                    "Does the quote include hair extensions, false lashes, and fresh floral accessories?",
                    "How many assistants will accompany you for mother-of-the-bride / bridesmaids?"
                ],
                comparison_criteria=[
                    "Longevity of makeup under heavy stage lighting and perspiration",
                    "Punctuality record for early morning muhurat / party schedules",
                    "Cleanliness of cosmetic brushes and hygienic beauty blenders"
                ],
                typical_cost_range=f"{curr}15,000 - {curr}45,000",
                cautionary_advice="Block your artist with an advance receipt early. High-demand wedding muhurat dates get triple-booked."
            )
        ]

    def generate_personalized_ideas(self, req: EventRequest) -> PersonalizedIdeas:
        """Personalized themes, palettes, menus, invitations and activities."""
        is_wedding = "wedding" in req.event_type.lower()
        is_birthday = "birthday" in req.event_type.lower()
        is_college = "college" in req.event_type.lower() or "fest" in req.event_type.lower()

        if is_wedding:
            theme_title = req.theme_preference or "Royal Rajputana & Marigold Splendor"
            theme_desc = (
                f"A regal celebration celebrating timeless Indian heritage in {req.city_or_location}. "
                "Featuring brass urli water installations with floating mogra, warm amber lighting, "
                "and opulent velvet drapes accented with vibrant marigold garlands."
            )
            palette = [
                ColorPaletteItem(name="Royal Marigold", hex="#FF9933", role="Primary Vibrant"),
                ColorPaletteItem(name="Deep Rani Pink", hex="#D81B60", role="Accent Floral"),
                ColorPaletteItem(name="Imperial Emerald", hex="#004D40", role="Rich Contrast"),
                ColorPaletteItem(name="Champagne Gold", hex="#D4AF37", role="Metallic Trim"),
                ColorPaletteItem(name="Ivory Cream", hex="#FDFBF7", role="Neutral Canvas"),
            ]
            decor_concepts = [
                "Grand entrance pathway lined with brass lanterns and fresh rose petal carpet",
                "Mandap under an open canopy of inverted floral strings with hand-carved wooden pillars",
                "Fairy-light canopy ceiling across guest dining area creating a starry night effect",
                "Interactive photo corner with vintage royal jharokha frame and auto-printing photo booth",
                "Customized signage with calligraphy welcoming families in both English and Hindi/Regional script"
            ]
            menu = {
                "Welcome Coolers": ["Royal Kesar Pista Thandai", "Fresh Mint Mojito", "Aam Panna with Black Salt"],
                "Live Chaat & Starters": ["Kurkuri Dahi Puri with Anar", "Tandoori Paneer Tikka with Mint Chutney", "Crispy Lotus Stem in Sweet Chili", "Mini Corn & Cheese Potlis"],
                "Royal Main Course": ["Paneer Lababdar in Rich Tomato Gravy", "Dal Bukhara Slow-Cooked Overnight", "Subz Dum Biryani with Burani Raita", "Amritsari Kulchas & Butter Naan", "Methi Malai Matar"],
                "Dessert Studio": ["Hot Kesari Jalebi with Chilled Rabdi", "Gulab Jamun Flambé", "Artisanal Sitaphal / Mango Kulfi", "Assorted Dry Fruit Halwa Cups"]
            }
            activities = [
                CulturalActivity(name="Phoolon Ki Holi & Haldi Revelry", description="Guests shower organic yellow marigold petals over the couple accompanied by live dhol.", timing="Morning Pre-Event"),
                CulturalActivity(name="Sangeet Family Dance Face-Off", description="Friendly choreographed dance competition between bride & groom sides judged by audience applause.", timing="Evening Sangeet"),
                CulturalActivity(name="Live Lac Bangle Making Stall", description="Traditional artisan creates custom-sized glass and lac bangles for visiting women guests.", timing="Throughout Reception"),
                CulturalActivity(name="Retro Polaroid Guestbook", description="Guests snap instant photos, glue them into a leather-bound journal, and pen handwritten blessings.", timing="Arrival Lounge")
            ]
            invitations = {
                "Formal & Traditional": (
                    f"Two families, two hearts, one eternal journey. With the blessings of our elders and the grace of the Almighty, "
                    f"we cordially invite you to celebrate the joyous union of our families. "
                    f"Date: {req.event_date} | Venue: {req.city_or_location}. Your presence and blessings will make our celebration complete."
                ),
                "Playful & Contemporary": (
                    f"We said YES! Now it's time to dance, feast, and make unforgettable memories together. "
                    f"Join us as we tie the knot on {req.event_date} in {req.city_or_location}. "
                    f"Bring your dancing shoes, endless smiles, and an empty stomach for a royal feast!"
                ),
                "Digital WhatsApp Short": (
                    f"💍 SAVE THE DATE! 🎉\nWe are getting married! ✨\n🗓️ Date: {req.event_date}\n📍 Location: {req.city_or_location}\n"
                    f"Guests: Celebrating with {req.guest_count} of our dearest friends & family.\nRSVP & Event Schedule: [Link]\n"
                    f"We can't wait to celebrate with you!"
                )
            }
            favors = [
                "Handcrafted brass candle holders paired with organic botanical honey jars",
                "Custom-engraved wooden seed kits symbolizing blossoming love",
                "Box of bespoke regional artisanal sweets (Kaju Katli & Roasted Dry Fruits)"
            ]
        elif is_birthday:
            theme_title = req.theme_preference or "Enchanted Celestial Galaxy"
            theme_desc = (
                f"A magical birthday celebration in {req.city_or_location} designed for {req.guest_count} guests. "
                "Featuring shimmering cosmic neon accents, metallic chrome balloon arches, and immersive ambient lighting."
            )
            palette = [
                ColorPaletteItem(name="Cosmic Midnight Blue", hex="#0D1B2A", role="Base Sky"),
                ColorPaletteItem(name="Electric Violet", hex="#7B2CBF", role="Neon Glow"),
                ColorPaletteItem(name="Starlight Gold", hex="#FFD166", role="Metallic Highlight"),
                ColorPaletteItem(name="Iridescent Silver", hex="#E0E1DD", role="Accent Shimmer")
            ]
            decor_concepts = [
                "Geometric photo arch accented with floating starburst balloons and neon 'Happy Birthday' cursive sign",
                "Glow-in-the-dark galaxy table centerpieces with LED micro-lights",
                "Personalized photo memory wall highlighting key milestones over the years"
            ]
            menu = {
                "Sippers & Punches": ["Electric Blue Citrus Fizz", "Strawberry Basil Lemonade", "Nutella Iced Frappe"],
                "Bite-Sized Starters": ["Mini Gourmet Sliders (Veg & Paneer)", "Truffle Fries with Herb Aioli", "Crispy Cheesy Nachos Bar with Guacamole", "Veg Dimsums"],
                "Comfort Mains": ["Creamy Penne Alfredo with Garlic Bread", "Wood-Fired Margherita & Farmhouse Pizza", "Signature Biryani Bowls"],
                "Sweet Finale": ["2-Tier Celestial Gravity-Defying Cake", "Belgian Chocolate Churros", "Mini Red Velvet Cupcakes"]
            }
            activities = [
                CulturalActivity(name="Interactive Mystery Escape Quest", description="Guests solve lighthearted customized riddles about the birthday star to unlock secret party favors.", timing="First Hour"),
                CulturalActivity(name="Live DJ Dance-Off & Freeze Dance", description="High-energy dance battles with LED glowsticks and confetti cannons.", timing="Pre-Cake Cutting"),
                CulturalActivity(name="Cosmic Mocktail Creation Bar", description="Guests shake their own color-changing butterfly pea flower mocktails with edible glitter.", timing="Ongoing Lounge")
            ]
            invitations = {
                "Formal & Classic": f"Please join us to celebrate a special birthday milestone on {req.event_date} at {req.city_or_location}. An evening of great food, music, and laughter awaits.",
                "Playful & Contemporary": f"Another year bolder, brighter, and ready to party! Come celebrate with us on {req.event_date} in {req.city_or_location}. Get ready for great vibes and epic cake!",
                "Digital WhatsApp Short": f"🎂 PARTY ALERT! 🎈\nCelebrate with us on {req.event_date} in {req.city_or_location}.\nDress code: Fun & Festive ✨\nLet us know if you can make it!"
            }
            favors = [
                "Customized cosmic scented travel candles",
                "Artisan gourmet chocolate truffle box",
                "Personalized monogrammed reusable canvas tote bag"
            ]
        elif is_college:
            theme_title = req.theme_preference or "Neon Pulse: Cybernetic Nexus"
            theme_desc = (
                f"An electrifying collegiate festival in {req.city_or_location} for {req.guest_count} students. "
                "Featuring high-energy visual mapping, laser arrays, dynamic bass frequencies, and competitive arenas."
            )
            palette = [
                ColorPaletteItem(name="Cyber Cyan", hex="#00F5D4", role="Vibrant Primary"),
                ColorPaletteItem(name="Hyper Magenta", hex="#F72585", role="High Energy"),
                ColorPaletteItem(name="Abyssal Black", hex="#0A0908", role="Dark Canvas"),
                ColorPaletteItem(name="Electric Amber", hex="#FFB703", role="Warning Accent")
            ]
            decor_concepts = [
                "Truss-mounted laser light tunnels leading into the main quadrangle",
                "High-definition LED backdrop displaying interactive generative audio visualizers",
                "Graffiti wall where attendees can spray digital light-graffiti via sensor cans"
            ]
            menu = {
                "Energy Boosters": ["Cold Brew Nitro Coffee", "Mint Limeade Hydration Coolers", "Electrolyte Fruit Spritzers"],
                "Quick Street Grabs": ["Loaded Mexican Tacos & Burrito Bowls", "Paneer Shawarma Wraps", "Spicy Schezwan Fried Wontons", "Cheesy Loaded Nachos"],
                "Main Fuel": ["Hyderabadi Veg Biryani with Mirchi Salan", "Paneer Butter Masala with Kulcha", "Street Hakka Noodles & Manchurian"],
                "Late Night Munchies": ["Belgian Waffle Bites with Nutella", "Soft Serve Ice Cream Cones"]
            }
            activities = [
                CulturalActivity(name="Flagship Battle of the Bands", description="Collegiate music bands battle on stage for regional bragging rights and cash prizes.", timing="Evening Showcase"),
                CulturalActivity(name="Silent Headphone Disco Arena", description="Dual DJ channels where attendees switch channels on wireless multi-colored glowing headphones.", timing="Late Night"),
                CulturalActivity(name="24-Hour Hackathon / Gaming Jam", description="High-intensity tech hackathon running in parallel with live streaming on campus LED screens.", timing="Day 1 to Day 2")
            ]
            invitations = {
                "Official Collegiate Call": f"The organizing committee cordially invites all delegates and colleges to our Annual Cultural & Tech Extravaganza on {req.event_date} at {req.city_or_location}.",
                "Hype Festival Drop": f"Turn up the voltage! ⚡ The biggest campus festival of the year is dropping on {req.event_date}. Concerts, food trucks, esports, and glory. Grab your passes!",
                "WhatsApp Broadcast": f"🔥 PASSES LIVE NOW! 🎟️\nCampus Fest on {req.event_date} @ {req.city_or_location}.\nHeadlining Artist + 30+ Events.\nRegister fast before passes sell out!"
            }
            favors = [
                "Festival lanyard with holographic badge & enamel pin",
                "Heavyweight screen-printed commemorative cotton hoodie",
                "Tech sponsor goodie pack with stickers and cloud credits"
            ]
        else:
            theme_title = req.theme_preference or "Festive Harmony & Community Glow"
            theme_desc = (
                f"A warm, inclusive community celebration in {req.city_or_location} uniting {req.guest_count} neighbors and families."
            )
            palette = [
                ColorPaletteItem(name="Auspicious Saffron", hex="#FF9933", role="Warmth"),
                ColorPaletteItem(name="Forest Green", hex="#2D6A4F", role="Prosperity"),
                ColorPaletteItem(name="Golden Ochre", hex="#E9C46A", role="Festive Light"),
                ColorPaletteItem(name="Ivory White", hex="#F8F9FA", role="Peace")
            ]
            decor_concepts = [
                "Erected shamiana with traditional yellow fabric draping and mango leaf festoons",
                "Communal brass deepams lit along perimeter walkways",
                "Giant hand-crafted floral rangoli at the central community pavilion"
            ]
            menu = {
                "Traditional Welcome": ["Jaljeera with Boondi", "Sweet Badam Milk", "Kokum Sharbat"],
                "Community Feast": ["Puri with Aloo Bhaji", "Paneer Makhani", "Sambhar with Steamed Rice", "Khaman Dhokla with Green Chutney"],
                "Maha Prasadam Sweets": ["Besan Ladoos with Pistachio", "Kheer / Payasam with Saffron", "Moong Dal Halwa"]
            }
            activities = [
                CulturalActivity(name="Inter-Generational Folk Music & Bhajans", description="Local children and senior citizens perform traditional devotional and folk melodies.", timing="Morning Puja / Gathering"),
                CulturalActivity(name="Rangoli & Traditional Art Contest", description="Neighborhood families create decorative patterns judged by senior community mentors.", timing="Afternoon"),
                CulturalActivity(name="Community Felicitation Ceremony", description="Honoring local volunteers, achievers, and senior community stalwarts.", timing="Evening")
            ]
            invitations = {
                "Formal Community Letter": f"All residents and families are warmly invited to celebrate our Annual Community Gathering on {req.event_date} at {req.city_or_location}.",
                "Playful Neighborly Invite": f"Good food, great neighbors, and festive cheer! Join us on {req.event_date} for our annual community celebration. Bring your family and your joy!",
                "Digital WhatsApp Notice": f"🌟 COMMUNITY CELEBRATION! 🕊️\nDate: {req.event_date} | Venue: {req.city_or_location}\nAll residents and guests welcome. Feast follows cultural program.\nLet us celebrate together!"
            }
            favors = [
                "Eco-friendly Tulsi / flowering plant sapling",
                "Traditional brass diya or incense holder",
                "Artisanal box of pure ghee laddoos"
            ]

        return PersonalizedIdeas(
            theme_title=theme_title,
            theme_description=theme_desc,
            color_palette=palette,
            decor_concepts=decor_concepts,
            curated_menu=menu,
            cultural_activities=activities,
            invitation_wordings=invitations,
            favors_and_gifts=favors
        )

    def _call_gemini_enhancement(self, req: EventRequest, base_ideas: PersonalizedIdeas) -> Optional[Dict[str, Any]]:
        """Call Gemini via lightweight HTTP or SDK to enhance creative recommendations."""
        if not self.api_key and not self.client:
            return None

        prompt = f"""You are the EventGenie AI Creative Director.
Generate bespoke, hyper-personalized ideas for an upcoming celebration:
- Event: {req.title} ({req.event_type})
- Location: {req.city_or_location}
- Date: {req.event_date}
- Guests: {req.guest_count}
- Total Budget: {req.currency}{req.total_budget:,.2f}
- Theme Preference: {req.theme_preference or 'Regional Luxury'}
- Special Notes: {req.special_notes or 'None'}

Return ONLY a valid JSON object with:
{{
  "theme_title": "string",
  "theme_description": "string",
  "decor_concepts": ["concept 1", "concept 2", "concept 3", "concept 4"],
  "curated_menu": {{
    "Welcome Drinks": ["drink 1", "drink 2"],
    "Appetizers & Starters": ["starter 1", "starter 2", "starter 3"],
    "Main Course": ["dish 1", "dish 2", "dish 3"],
    "Desserts": ["sweet 1", "sweet 2"]
  }},
  "invitation_wordings": {{
    "Formal & Traditional": "wording 1",
    "Playful & Contemporary": "wording 2",
    "Digital WhatsApp Short": "wording 3"
  }},
  "favors_and_gifts": ["gift 1", "gift 2", "gift 3"]
}}"""

        # Method 1: Lightweight HTTP REST (Ultra-fast, zero grpcio bloat, perfect for Vercel/Cloud Run)
        for model in [GEMINI_MODEL_PRIMARY, GEMINI_MODEL_FALLBACK]:
            if not self.api_key:
                break
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.7
                    }
                }
                with httpx.Client(timeout=15.0) as client:
                    resp = client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            if raw_text:
                                return json.loads(raw_text)
            except Exception as e:
                print(f"Gemini REST call failed for {model}: {e}")

        # Method 2: If google.genai client is available
        if self.client:
            try:
                response = self.client.models.generate_content(
                    model=GEMINI_MODEL_PRIMARY,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.7
                    )
                )
                if response and response.text:
                    return json.loads(response.text)
            except Exception as e:
                print(f"Fallback SDK call failed: {e}")

        return None

    def create_plan(self, req: EventRequest) -> EventPlan:
        """Create complete, verified, and structured event plan."""
        # 1. Programmatic deterministic budget calculation (NO LLM hallucinated math)
        categories, total_allocated, remaining_budget, cost_per_guest = calculate_budget_breakdown(
            total_budget=req.total_budget,
            guest_count=req.guest_count,
            event_type=req.event_type
        )
        contingency_fund = next((c.allocated_amount for c in categories if "contingency" in c.name.lower()), 0.0)

        # 2. Automated timeline tasks
        timeline_tasks = self.generate_timeline(req)

        # 3. Vendor checklist with comparison criteria
        vendor_checklist = self.generate_vendor_checklist(req)

        # 4. Personalized ideas (with optional Gemini enhancement)
        ideas = self.generate_personalized_ideas(req)
        ai_meta = {
            "service_used": "EventGenie Deterministic Intelligence Engine",
            "model": "rule-based-expert-system",
            "gemini_active": False,
            "timestamp": datetime.utcnow().isoformat()
        }

        if self.client:
            gemini_result = self._call_gemini_enhancement(req, ideas)
            if gemini_result:
                if gemini_result.get("theme_title"):
                    ideas.theme_title = gemini_result["theme_title"]
                if gemini_result.get("theme_description"):
                    ideas.theme_description = gemini_result["theme_description"]
                if gemini_result.get("decor_concepts"):
                    ideas.decor_concepts = gemini_result["decor_concepts"]
                if gemini_result.get("curated_menu"):
                    ideas.curated_menu = gemini_result["curated_menu"]
                if gemini_result.get("invitation_wordings"):
                    ideas.invitation_wordings = gemini_result["invitation_wordings"]
                if gemini_result.get("favors_and_gifts"):
                    ideas.favors_and_gifts = gemini_result["favors_and_gifts"]

                ai_meta["service_used"] = "Google Gemini via google-genai SDK"
                ai_meta["model"] = GEMINI_MODEL_PRIMARY
                ai_meta["gemini_active"] = True

        disclosures = [
            f"All budget line items are mathematically calculated in application code based on {req.currency}{req.total_budget:,.2f} total allocation.",
            "Prices and cost ranges reflect prevailing regional market benchmarks for reputable vendors and may vary with seasonal wedding muhurats.",
            "Contingency safety reserve (5-7%) is kept uncommitted to absorb overtime fees and surprise guest arrivals.",
            "Vendor checklist items highlight comparison criteria and negotiation guidelines; no unverified private businesses are falsely promoted."
        ]

        return EventPlan(
            event_request=req,
            total_budget=req.total_budget,
            total_allocated=total_allocated,
            remaining_budget=remaining_budget,
            contingency_fund=contingency_fund,
            cost_per_guest=cost_per_guest,
            budget_categories=categories,
            timeline_tasks=timeline_tasks,
            vendor_checklist=vendor_checklist,
            personalized_ideas=ideas,
            assumptions_and_disclosures=disclosures,
            ai_generation_meta=ai_meta
        )

    def revise_plan(self, rev_req: PlanRevisionRequest, current_plan: EventPlan) -> Tuple[EventPlan, TradeOffAnalysis]:
        """
        Dynamic Replanning: Modifies an existing plan based on natural language requests
        e.g., 'Reduce my budget to ₹4,50,000' or 'Increase guests to 350'.
        Preserves all completed task states, recalculates programmatic budgets,
        and provides transparent trade-off analysis.
        """
        instruction = rev_req.instruction.strip()

        # Step 1: Detect instructions (Budget change, guest count change, theme change)
        new_budget = current_plan.total_budget
        new_guest_count = current_plan.event_request.guest_count
        new_theme = current_plan.event_request.theme_preference

        # Check for budget change patterns like "Reduce my budget to 450000" or "budget to ₹4,50,000"
        budget_match = re.search(r'(?:budget\s+(?:to|is|becomes)?\s*[₹$€£AED]*\s*([\d,]+(?:\.\d+)?))', instruction, re.IGNORECASE)
        if not budget_match:
            # Check for "reduce by 50000" or "cut by 50000"
            cut_match = re.search(r'(?:reduce|cut|decrease)\s+(?:budget\s+)?(?:by\s+)?[₹$€£AED]*\s*([\d,]+(?:\.\d+)?)', instruction, re.IGNORECASE)
            if cut_match:
                amount_cut = float(cut_match.group(1).replace(",", ""))
                new_budget = max(1000.0, current_plan.total_budget - amount_cut)
            else:
                # Check for "increase by 50000" or "add 50000"
                add_match = re.search(r'(?:increase|add|raise)\s+(?:budget\s+)?(?:by\s+)?[₹$€£AED]*\s*([\d,]+(?:\.\d+)?)', instruction, re.IGNORECASE)
                if add_match and "guest" not in instruction.lower():
                    amount_add = float(add_match.group(1).replace(",", ""))
                    new_budget = current_plan.total_budget + amount_add
        else:
            new_budget = float(budget_match.group(1).replace(",", ""))

        # Check for guest count changes like "Increase guests to 350" or "350 guests" or "add 50 guests"
        guest_match = re.search(r'(?:(?:guests?|pax)\s*(?:to|is|becomes)?\s*(\d+))|(?:\b(\d+)\s*(?:guests?|pax))', instruction, re.IGNORECASE)
        if guest_match:
            val = guest_match.group(1) or guest_match.group(2)
            if val:
                new_guest_count = int(val)
        else:
            add_guest_match = re.search(r'(?:add|increase|more)\s+(\d+)\s+(?:more\s+)?guests?', instruction, re.IGNORECASE)
            if add_guest_match:
                new_guest_count = current_plan.event_request.guest_count + int(add_guest_match.group(1))

        # Check for theme change like "Change theme to Bohemian Chic"
        theme_match = re.search(r'(?:theme\s+(?:to|is|becomes)?\s*[:]?\s*["\']?([^"\'.\n]+)["\']?)', instruction, re.IGNORECASE)
        if theme_match:
            new_theme = theme_match.group(1).strip()

        # Step 2: Programmatically recalculate categories with smart trade-off weighting
        updated_categories, trade_offs, affected_log = replan_budget_programmatically(
            current_categories=current_plan.budget_categories,
            old_budget=current_plan.total_budget,
            new_budget=new_budget,
            guest_count=new_guest_count,
            currency=current_plan.event_request.currency
        )

        sum_allocated = sum(c.allocated_amount for c in updated_categories)
        new_cost_per_guest = round(new_budget / new_guest_count, 2)
        contingency_fund = next((c.allocated_amount for c in updated_categories if "contingency" in c.name.lower()), 0.0)

        # Step 3: PRESERVE timeline completion states!
        existing_status_map = {t.title: t.completed for t in current_plan.timeline_tasks}
        updated_tasks: List[TimelineTask] = []
        for t in current_plan.timeline_tasks:
            completed_state = existing_status_map.get(t.title, t.completed)
            updated_tasks.append(t.model_copy(update={"completed": completed_state}))

        # Step 4: If theme changed or guest count changed, update personalized ideas accordingly
        updated_ideas = current_plan.personalized_ideas
        if new_theme != current_plan.event_request.theme_preference:
            temp_req = current_plan.event_request.model_copy(update={"theme_preference": new_theme, "guest_count": new_guest_count, "total_budget": new_budget})
            updated_ideas = self.generate_personalized_ideas(temp_req)
            trade_offs.append(f"Updated creative styling, color palette, and decor concepts to align with '{new_theme}'.")

        # Step 5: Construct TradeOffAnalysis
        delta = new_budget - current_plan.total_budget
        completed_count = sum(1 for t in updated_tasks if t.completed)
        preservation_notes = f"All {len(updated_tasks)} timeline tasks retained. {completed_count} completed tasks preserved."

        trade_off_analysis = TradeOffAnalysis(
            summary=(
                f"Successfully recalculated plan for {new_guest_count} guests with budget "
                f"{current_plan.event_request.currency}{new_budget:,.2f}."
            ),
            budget_delta=round(delta, 2),
            affected_categories=affected_log,
            trade_offs=trade_offs,
            preservation_notes=preservation_notes
        )

        # Step 6: Assemble Revised EventPlan
        revised_req = current_plan.event_request.model_copy(update={
            "total_budget": new_budget,
            "guest_count": new_guest_count,
            "theme_preference": new_theme
        })

        revised_plan = current_plan.model_copy(update={
            "event_request": revised_req,
            "total_budget": new_budget,
            "total_allocated": round(sum_allocated, 2),
            "remaining_budget": round(new_budget - sum_allocated, 2),
            "contingency_fund": contingency_fund,
            "cost_per_guest": new_cost_per_guest,
            "budget_categories": updated_categories,
            "timeline_tasks": updated_tasks,
            "personalized_ideas": updated_ideas,
            "updated_at": datetime.utcnow().isoformat(),
            "revision_count": current_plan.revision_count + 1,
            "trade_off_log": current_plan.trade_off_log + [{
                "instruction": instruction,
                "timestamp": datetime.utcnow().isoformat(),
                "budget_delta": delta,
                "trade_offs": trade_offs
            }]
        })

        return revised_plan, trade_off_analysis

# Global engine instance
planner_engine = EventPlannerEngine()
