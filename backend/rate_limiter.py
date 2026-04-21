import os
import time
from collections import defaultdict, deque

MAX_REQUESTS_PER_MINUTE = int(os.getenv("MAX_REQUESTS_PER_MINUTE", "60"))
REQUEST_LOGS = defaultdict(lambda: deque())
WINDOW_SECONDS = 60


def is_rate_limited(client_id: str) -> tuple[bool, int]:
    now = time.time()
    window_start = now - WINDOW_SECONDS
    requests = REQUEST_LOGS[client_id]

    while requests and requests[0] < window_start:
        requests.popleft()

    if len(requests) >= MAX_REQUESTS_PER_MINUTE:
        retry_after = int(max(1, WINDOW_SECONDS - (now - requests[0])))
        return True, retry_after

    requests.append(now)
    return False, 0
