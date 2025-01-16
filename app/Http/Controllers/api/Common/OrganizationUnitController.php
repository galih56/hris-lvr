<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\OrganizationUnitRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\OrganizationUnit\StoreOrganizationUnitRequest;
use App\Http\Requests\Common\OrganizationUnit\UpdateOrganizationUnitRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\OrganizationUnitResource;

class OrganizationUnitController extends Controller
{
    private OrganizationUnitRepositoryInterface $organizationUnitRepository;
    
    public function __construct(OrganizationUnitRepositoryInterface $organizationUnitRepository)
    {
        $this->organizationUnitRepository = $organizationUnitRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $filters = [];

        $data = $this->organizationUnitRepository->get($filters, $perPage, []);

        if($perPage){
            $org_units = [
                'data' => OrganizationUnitResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($org_units,200);
        }else{
            $org_units = OrganizationUnitResource::collection($data);
            return ApiResponse::sendResponse($org_units,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrganizationUnitRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $org_unit = $this->organizationUnitRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($org_unit,'OrganizationUnit Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $org_unit = $this->organizationUnitRepository->find($id);

        return ApiResponse::sendResponse(new OrganizationUnitResource($org_unit),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateOrganizationUnitRequest $request)
    {
        DB::beginTransaction();
        try{
            $org_unit = $this->organizationUnitRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $org_unit , 'OrganizationUnit Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->organizationUnitRepository->delete($id);
        
        return ApiResponse::sendResponse('OrganizationUnit Delete Successful','',204);
    }

    public function checkOrganizationUnitCode($search)
    {
        $org_unitData = $this->organizationUnitRepository->checkOrganizationUnitCode($search);
    
        if ($org_unitData['status'] === 'no_organizationUnit') {
            return ApiResponse::sendResponse(null, $org_unitData['message'], 'error', 404);
        }
    
        return ApiResponse::sendResponse($org_unitData['data'], $org_unitData['message'], 'success', 200);
    }
}
