# DIVANO — Thème Shopify

Thème Shopify sur-mesure pour **Divano**, marque de mobilier premium.
Conçu pour le marché marocain : **100 % en français**, prix en **MAD**,
mention paiement à la livraison.

## Identité visuelle

| Élément        | Valeur                                  |
|----------------|-----------------------------------------|
| Vert principal | `#16352B` (en-tête, hero, pied de page) |
| Vert foncé     | `#0F2820`                               |
| Crème (fond)   | `#F4EFE7`                               |
| Crème carte    | `#FBF8F3`                               |
| Texte          | `#16140F`                               |
| Accent caramel | `#B5793A`                               |
| Titres         | Playfair Display (serif éditorial)      |
| Texte courant  | Assistant (sans-serif)                  |

Toutes ces valeurs sont modifiables dans **Personnaliser → Paramètres du thème**.

## Structure (sections de la page d'accueil)

1. **Barre d'annonce** — livraison offerte
2. **En-tête** — logo blanc, menu, recherche / compte / panier
3. **Hero** — titre éditorial + étiquettes produit flottantes
4. **Intro + statistique** — mission + avatars + chiffre clé
5. **Produits populaires** — grille avec onglets de catégorie
6. **Acheter par catégorie** — carrousel de cartes
7. **Atouts** — « Conçu pour le confort » (grille + image)
8. **Carrousel de collection** — « Pièces d'exception »
9. **Témoignages** — avis clients
10. **Newsletter** — bannière d'inscription
11. **Pied de page** — colonnes + grand mot-symbole DIVANO

Pages incluses : accueil, produit, collection, liste de collections,
panier, recherche, page, blog, article, 404, carte cadeau, mot de passe.

## Installation

1. Compresser le dossier en `.zip` (contenu à la racine, pas de dossier parent) :
   ```bash
   zip -r divano-theme.zip assets config layout locales sections snippets templates
   ```
2. Admin Shopify → **Boutique en ligne → Thèmes → Ajouter → Importer le thème**.
3. **Personnaliser** pour relier vos collections aux onglets et catégories.

### Avec Shopify CLI (recommandé)
```bash
shopify theme dev      # aperçu en local
shopify theme push     # envoi vers la boutique
```

## Images

Les visuels sont dans `assets/` (voir `assets/README.md` pour la liste des noms).
Chaque section possède un sélecteur d'image dans l'éditeur ; à défaut, un visuel
par défaut de la marque est utilisé automatiquement.

> Astuce : reliez vos vraies collections Shopify dans **Produits populaires**,
> **Acheter par catégorie** et **Carrousel de collection** pour afficher vos
> produits réels à la place des exemples.
