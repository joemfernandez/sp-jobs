import DateFormatter from '../src/core/DateFormatter';

test('formats date for display', () => {
    const df = DateFormatter('en-US');
    const result = df.formatDisplay('2024-01-15');
    expect(result).toContain('2024');
});

test('returns sortable timestamp', () => {
    const df = DateFormatter();
    const value = df.formatSortValue('2024-01-15');
    expect(typeof value).toBe('number');
});
