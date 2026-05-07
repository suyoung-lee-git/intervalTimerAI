import { startTimer } from "../timer";

jest.useFakeTimers();

describe("startTimer", () => {
  afterEach(() => jest.clearAllTimers());

  it("첫 tick에 work 페이즈와 workSecs를 반환한다", () => {
    const ticks: Parameters<Parameters<typeof startTimer>[3]>[0][] = [];
    const stop = startTimer(20, 10, 2, (tick) => ticks.push(tick), jest.fn());

    jest.advanceTimersByTime(1000);
    expect(ticks[0]).toMatchObject({ phase: "work", remainingSecs: 20 });

    stop();
  });

  it("workSecs 후 rest 페이즈로 전환된다", () => {
    const ticks: Parameters<Parameters<typeof startTimer>[3]>[0][] = [];
    const stop = startTimer(2, 10, 1, (tick) => ticks.push(tick), jest.fn());

    jest.advanceTimersByTime(4000);
    const phases = ticks.map((t) => t.phase);
    expect(phases).toContain("rest");

    stop();
  });

  it("모든 세트 완료 후 onComplete를 호출한다", () => {
    const onComplete = jest.fn();
    startTimer(1, 1, 1, jest.fn(), onComplete);

    jest.advanceTimersByTime(5000);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("stop 함수 호출 시 타이머가 중단된다", () => {
    const ticks: unknown[] = [];
    const stop = startTimer(10, 5, 3, (t) => ticks.push(t), jest.fn());

    jest.advanceTimersByTime(2000);
    const countBefore = ticks.length;
    stop();
    jest.advanceTimersByTime(5000);
    expect(ticks.length).toBe(countBefore);
  });
});
