import { CityModel } from "../../Model/CityModel.js"

export const SeedCity = async () => {
    await CityModel.deleteMany({})
    await CityModel.create([
        {
            cityName: "Ahmadpur East"
        },
        {
            cityName: "Ahmed Nager Chatha"
        },
        {
            cityName: "Ali Khan Abad"
        },
        {
            cityName: "Alipur"
        },
        {
            cityName: "Arifwala"
        },
        {
            cityName: "Attock"
        },
        {
            cityName: "Bhera"
        },
        {
            cityName: "Bhalwal"
        },
        {
            cityName: "Bahawalnagar"
        },
        {
            cityName: "Bahawalpur"
        },
        {
            cityName: "Bhakkar"
        },
        {
            cityName: "Burewala"
        },
        {
            cityName: "Chenab Nagar"
        },
        {
            cityName: "Chillianwala"
        },
        {
            cityName: "Choa Saidanshah"
        },
        {
            cityName: "Chakwal"
        },
        {
            cityName: "Chak Jhumra"
        },
        {
            cityName: "Chichawatni"
        },
        {
            cityName: "Chiniot"
        },
        {
            cityName: "Chishtian"
        },
        {
            cityName: "Chunian"
        },
        {
            cityName: "Dajkot"
        },
        {
            cityName: "Daska"
        },
        {
            cityName: "Davispur"
        },
        {
            cityName: "Darya Khan"
        },
        {
            cityName: "Dera Ghazi Khan"
        },
        {
            cityName: "Dhaular"
        },
        {
            cityName: "Dina"
        },
        {
            cityName: "Dinga"
        },
        {
            cityName: "Dhudial Chakwal"
        },
        {
            cityName: "Dipalpur"
        },
        {
            cityName: "Faisalabad"
        },
        {
            cityName: "Fateh Jang"
        },
        {
            cityName: "Ghakhar Mandi"
        },
        {
            cityName: "Gojra"
        },
        {
            cityName: "Gujranwala"
        },
        {
            cityName: "Gujrat"
        },
        {
            cityName: "Gujar Khan"
        },
        {
            cityName: "Harappa"
        },
        {
            cityName: "Hafizabad"
        },
        {
            cityName: "Haroonabad"
        },
        {
            cityName: "Hasilpur"
        },
        {
            cityName: "Haveli Lakha"
        },
        {
            cityName: "Jalalpur Jattan"
        },
        {
            cityName: "Jampur"
        },
        {
            cityName: "Jaranwala"
        },
        {
            cityName: "Jhang"
        },
        {
            cityName: "Jhelum"
        },
        {
            cityName: "Kallar Syedan"
        },
        {
            cityName: "Kalabagh"
        },
        {
            cityName: "Karor Lal Esan"
        },
        {
            cityName: "Kasur"
        },
        {
            cityName: "Kamalia"
        },
        {
            cityName: "Kāmoke"
        },
        {
            cityName: "Khanewal"
        },
        {
            cityName: "Khanpur"
        },
        {
            cityName: "Khanqah Sharif"
        },
        {
            cityName: "Kharian"
        },
        {
            cityName: "Khushab"
        },
        {
            cityName: "Kot Adu"
        },
        {
            cityName: "Jauharabad"
        },
        {
            cityName: "Lahore"
        },
        {
            cityName: "Islamabad"
        },
        {
            cityName: "Lalamusa"
        },
        {
            cityName: "Layyah"
        },
        {
            cityName: "Lawa Chakwal"
        },
        {
            cityName: "Liaquat Pur"
        },
        {
            cityName: "Lodhran"
        },
        {
            cityName: "Malakwal"
        },
        {
            cityName: "Mamoori"
        },
        {
            cityName: "Mailsi"
        },
        {
            cityName: "Mandi Bahauddin"
        },
        {
            cityName: "Mian Channu"
        },
        {
            cityName: "Mianwali"
        },
        {
            cityName: "Miani"
        },
        {
            cityName: "Multan"
        },
        {
            cityName: "Murree"
        },
        {
            cityName: "Muridke"
        },
        {
            cityName: "Mianwali Bangla"
        },
        {
            cityName: "Muzaffargarh"
        },
        {
            cityName: "Narowal"
        },
        {
            cityName: "Nankana Sahib"
        },
        {
            cityName: "Okara"
        },
        {
            cityName: "Renala Khurd"
        },
        {
            cityName: "Pakpattan"
        },
        {
            cityName: "Pattoki"
        },
        {
            cityName: "Pindi Bhattian"
        },
        {
            cityName: "Pind Dadan Khan"
        },
        {
            cityName: "Pir Mahal"
        },
        {
            cityName: "Qaimpur"
        },
        {
            cityName: "Qila Didar Singh"
        },
        {
            cityName: "Raiwind"
        },
        {
            cityName: "Rajanpur"
        },
        {
            cityName: "Rahim Yar Khan"
        },
        {
            cityName: "Rawalpindi"
        },
        {
            cityName: "Sadiqabad"
        },
        {
            cityName: "Sagri"
        },
        {
            cityName: "Sahiwal"
        },
        {
            cityName: "Sambrial"
        },
        {
            cityName: "Samundri"
        },
        {
            cityName: "Sangla Hill"
        },
        {
            cityName: "Sarai Alamgir"
        },
        {
            cityName: "Sargodha"
        },
        {
            cityName: "Shakargarh"
        },
        {
            cityName: "Sheikhupura"
        },
        {
            cityName: "Shujaabad"
        },
        {
            cityName: "Sialkot"
        },
        {
            cityName: "Sohawa"
        },
        {
            cityName: "Soianwala"
        },
        {
            cityName: "Siranwali"
        },
        {
            cityName: "Tandlianwala"
        },
        {
            cityName: "Talagang"
        },
        {
            cityName: "Taxila"
        },
        {
            cityName: "Toba Tek Singh"
        },
        {
            cityName: "Vehari"
        },
        {
            cityName: "Wah Cantonment"
        },
        {
            cityName: "Wazirabad"
        },
        {
            cityName: "Yazman"
        },
        {
            cityName: "Zafarwal"
        },
    ])
    console.info("Cities are successfully seeded")
}