```
npm install
npm run dev
```

```
open http://localhost:3000
```

Frågor vid genomgången av uppgift:

1. Filtrering och Refresh token står som (fördjupning), är inte det lite förvirrande att de är på G nivån?
2.

UPPGIFT

Konto och inloggning
G1. En besökare kan skapa ett konto, logga in och logga ut.

G2. Inloggningen finns kvar när sidan laddas om, och appen kan alltid visa vem som är inloggad.

G3. Navigeringen visar olika innehåll för en inloggad användare och en utloggad besökare.

Boenden
G4. Alla kan se en lista över boenden och en detaljsida för varje boende.

G5. Listan kan filtreras på plats, maxpris och antal gäster.

G6. Bara inloggade användare kan skapa, ändra och ta bort boenden. Det gäller både i API:t och i databasen.

G7. En inloggad användare kan skapa ett nytt boende via ett formulär i frontenden.

G8. Listan kan sorteras på pris, stigande eller fallande. Sorteringen görs i backend.

Bokningar
G9. En inloggad användare kan boka ett boende från detaljsidan. En utloggad besökare uppmanas att logga in.

G10. En bokning med ogiltiga uppgifter nekas, till exempel ogiltig e-post, noll gäster eller incheckning efter utcheckning. Felet visas begripligt i formuläret.

G11. Bokningsformuläret visar antal nätter och totalpris innan användaren bokar.

G12. En inloggad användare kan se, ändra och ta bort bokningar för ett boende.
Kvalitet

G13. Appen visar en laddningsvy och en felvy när data hämtas, och en egen sida när ett boende inte finns.

G14. API:t svarar med rätt statuskod när ett anrop lyckas, när något skapas, när data är ogiltig, när användaren inte är inloggad och när något saknas.

G15. Databasen skyddar själv sina tabeller med behörighetsregler. Det räcker inte att bara API:t skyddar dem.

G16. All data är typad i både backend och frontend.

---

VG1. Ägarskap. Ett boende tillhör användaren som skapade det, och en bokning tillhör användaren som gjorde den. Bara ägaren kan ändra eller ta bort sitt boende. En gäst kan bara se sina egna bokningar, och ägaren av ett boende ser alla bokningar för det. Databasen ska garantera detta, inte bara API:t.
VG2. Inga dubbelbokningar. Ett boende kan inte bokas för datum som överlappar en befintlig bokning som inte är avbokad. Det gäller både när en bokning skapas och när den ändras. En bokning som ändras får inte räknas som en krock med sig själv. En krock nekas med ett eget, tydligt fel.
VG3. Kapacitet. Antalet gäster får inte vara större än boendets maxantal. Kontrollen utgår från boendets aktuella uppgifter i databasen, inte från något som klienten skickar.
VG4. Statusflöde med roller. Bara boendets ägare kan bekräfta en bokning. Gästen och ägaren kan båda avboka den. En väntande bokning kan bli bekräftad eller avbokad, en bekräftad bokning kan bli avbokad, och en avbokad bokning kan inte ändras. Otillåtna ändringar nekas med ett tydligt fel.
VG5. Tidsregler. Ett incheckningsdatum som redan har passerat nekas, och en bokning vars incheckning redan har passerat kan inte ändras eller avbokas.
VG6. Pris räknas på servern. Bokningens totalpris räknas ut i backend utifrån antal nätter och boendets pris, och sparas på bokningen. Ett pris som klienten skickar ignoreras. Om boendets pris ändras senare påverkas inte befintliga bokningar.
VG7. Sökning på lediga datum. API:t kan returnera de boenden som är lediga under en angiven period. Sökningen går att kombinera med filtren i G5 och sorteringen i G8. Ogiltiga perioder nekas.
