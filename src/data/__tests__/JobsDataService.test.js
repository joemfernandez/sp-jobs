import JobsDataService from '../JobsDataService';

test('returns jobs from http client', async () => {
    const fakeJobs = [{ id: 1, position: 'Developer' }];

    const mockHttp = {
        get: jest.fn().mockResolvedValue(fakeJobs)
    };

    const service = JobsDataService(mockHttp, '/fake/url');
    const result = await service.getAll();

    expect(mockHttp.get).toHaveBeenCalled();
    expect(result[0].raw).toBe(fakeJobs[0]);
});
