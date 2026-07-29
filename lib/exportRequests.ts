export function exportRequests(requests: any[]) {
    const rows = requests.map((r) => ({
        Type: r.type,
        Quartier: r.quartier,
        Budget: r.budget,
        Contact: r.user_contact,
        Active: r.is_active,
    }))

    const csv = [
        Object.keys(rows[0]).join(','),
        ...rows.map(Object.values).map((v) => v.join(',')),
    ].join('\n')

    const blob = new Blob(
        [csv],
        {
            type: 'text/csv',
        }
    )

    const url =
        URL.createObjectURL(blob)

    const a =
        document.createElement('a')

    a.href = url

    a.download = 'requests.csv'

    a.click()

    URL.revokeObjectURL(url)
}