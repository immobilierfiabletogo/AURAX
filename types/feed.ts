[{
	"resource": "/C:/Users/LENOVO/aurax/app/stand/[agencyId]/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Impossible d'assigner le type '{ id: string; title: string; image: string; city: string; price: string; agencyId: any; agencyName: any; agencyLogo: any; agencyPlan: any; boosted: boolean | null; }[]' au type 'FeedListing[]'.\n  Impossible d'assigner le type '{ id: string; title: string; image: string; city: string; price: string; agencyId: any; agencyName: any; agencyLogo: any; agencyPlan: any; boosted: boolean | null; }' au type 'FeedListing'.\n    Les types de la propriété 'boosted' sont incompatibles.\n      Impossible d'assigner le type 'boolean | null' au type 'boolean | undefined'.\n        Impossible d'assigner le type 'null' au type 'boolean | undefined'.",
	"source": "ts",
	"startLineNumber": 45,
	"startColumn": 9,
	"endLineNumber": 45,
	"endColumn": 17,
	"relatedInformation": [
		{
			"startLineNumber": 21,
			"startColumn": 3,
			"endLineNumber": 21,
			"endColumn": 11,
			"message": "Le type attendu provient de la propriété 'listings', qui est déclarée ici sur le type 'IntrinsicAttributes & Props'",
			"resource": "/C:/Users/LENOVO/aurax/components/feed/FeedGrid.tsx"
		}
	],
	"modelVersionId": 5,
	"origin": "extHost1"
}]