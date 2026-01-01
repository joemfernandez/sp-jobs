import JobDataService from '../src/data/JobDataService';

test('returns jobs from http client', async () => {
    const fakeJobs = [{ id: 1, position: 'Developer' }];

    const mockHttp = {
        get: jest.fn().mockResolvedValue(fakeJobs)
    };

    const service = JobDataService(mockHttp, '/fake/url');
    const result = await service.getAll();

    expect(mockHttp.get).toHaveBeenCalled();
    expect(result).toEqual(fakeJobs);
});
